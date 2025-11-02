import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';
import sharp from 'sharp';
import { Resource } from '@/models/resource.model';

interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

const s3Config: S3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || 'ap-south-1',
  bucket: process.env.AWS_BUCKET_NAME || 'src-static-file'
};

if (!s3Config.accessKeyId || !s3Config.secretAccessKey) {
  throw new Error('AWS credentials are not configured. Check your .env file');
}

export const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey
  }
});

console.log(`✅ S3 Client initialized - Region: ${s3Config.region}, Bucket: ${s3Config.bucket}`);

interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  region: string;
  size: number;
  mimeType: string;
  etag?: string;
  versionId?: string;
  metadata?: Record<string, any>;
}

interface FileMetadata {
  originalName: string;
  extension: string;
  width?: number;
  height?: number;
  duration?: number;
}

export class S3Service {

  /**
   * Generate unique S3 key with organized folder structure
   * Pattern: uploads/{year}/{month}/{userId}/{timestamp}-{randomHash}-{filename}
   */
  generateS3Key(
    originalFilename: string,
    userId: string,
    category: string = 'general'
  ): string {
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    const sanitizedFilename = originalFilename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `uploads/${category}/${year}/${month}/${userId}/${timestamp}-${randomHash}-${sanitizedFilename}`;
  }

  /**
   * Get file extension and MIME type
   */
  getFileInfo(filename: string): { extension: string; mimeType: string } {
    const ext = path.extname(filename).toLowerCase();

    const mimeTypes: Record<string, string> = {
      // Images
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',

      // Documents
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv',

      // Code/Web
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.xml': 'application/xml',

      // Archives
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip',

      // Audio
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',

      // Video
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.webm': 'video/webm'
    };

    return {
      extension: ext,
      mimeType: mimeTypes[ext] || 'application/octet-stream'
    };
  }

  /**
   * Process image (resize, optimize, generate thumbnail)
   */
  async processImage(
    buffer: Buffer,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      generateThumbnail?: boolean;
    } = {}
  ): Promise<{ processed: Buffer; thumbnail?: Buffer; metadata: any }> {
    const {
      maxWidth = 2000,
      maxHeight = 2000,
      quality = 80,
      generateThumbnail = true
    } = options;

    // Get image metadata
    const metadata = await sharp(buffer).metadata();

    // Process main image
    let processedImage = sharp(buffer);

    if (metadata.width! > maxWidth || metadata.height! > maxHeight) {
      processedImage = processedImage.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    const processed = await processedImage
      .jpeg({ quality, progressive: true })
      .toBuffer();

    // Generate thumbnail
    let thumbnail: Buffer | undefined;
    if (generateThumbnail) {
      thumbnail = await sharp(buffer)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 70 })
        .toBuffer();
    }

    return { processed, thumbnail, metadata };
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    buffer: Buffer,
    originalFilename: string,
    userId: string,
    options: {
      category?: string;
      mimeType?: string;
      metadata?: Record<string, string>;
      processImage?: boolean;
      isPublic?: boolean;
    } = {}
  ): Promise<UploadResult> {
    try {
      const {
        category = 'general',
        processImage = false,
        isPublic = true
      } = options;

      let uploadBuffer = buffer;
      let thumbnailKey: string | undefined;
      let imageMetadata: any = {};

      // Process image if needed
      if (processImage && this.isImage(originalFilename)) {
        const processed = await this.processImage(buffer, {
          generateThumbnail: true
        });
        uploadBuffer = processed.processed;
        imageMetadata = processed.metadata;

        // Upload thumbnail
        if (processed.thumbnail) {
          const thumbKey = this.generateS3Key(
            `thumb-${originalFilename}`,
            userId,
            `${category}/thumbnails`
          );

          await this.uploadBuffer(processed.thumbnail, thumbKey, 'image/jpeg', isPublic);
          thumbnailKey = thumbKey;
        }
      }

      const key = this.generateS3Key(originalFilename, userId, category);
      const fileInfo = this.getFileInfo(originalFilename);
      const mimeType = options.mimeType || fileInfo.mimeType;

      const result = await this.uploadBuffer(
        uploadBuffer,
        key,
        mimeType,
        isPublic,
        options.metadata
      );

      return {
        ...result,
        metadata: {
          originalName: originalFilename,
          extension: fileInfo.extension,
          thumbnailKey,
          ...imageMetadata
        }
      };
    } catch (error) {
      console.error('❌ Upload file error:', error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Upload buffer to S3 (internal helper)
   */
  private async uploadBuffer(
    buffer: Buffer,
    key: string,
    mimeType: string,
    isPublic: boolean = true,
    metadata?: Record<string, string>
  ): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: metadata
    });

    const response = await s3Client.send(command);

    const url = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;

    console.log(`✅ File uploaded: ${key}`);

    return {
      key,
      url,
      bucket: s3Config.bucket,
      region: s3Config.region,
      size: buffer.length,
      mimeType,
      etag: response.ETag,
      versionId: response.VersionId
    };
  }

  /**
   * Upload large file with progress tracking
   */
  async uploadLargeFile(
    buffer: Buffer,
    originalFilename: string,
    userId: string,
    category: string = 'general',
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      const key = this.generateS3Key(originalFilename, userId, category);
      const fileInfo = this.getFileInfo(originalFilename);

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: s3Config.bucket,
          Key: key,
          Body: buffer,
          ContentType: fileInfo.mimeType,
          ACL: 'public-read'
        }
      });

      upload.on('httpUploadProgress', (progress: any) => {
        if (onProgress && progress.loaded && progress.total) {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          onProgress(percentage);
        }
      });

      const response = await upload.done();

      const url = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;

      console.log(`✅ Large file uploaded: ${key}`);

      return {
        key,
        url,
        bucket: s3Config.bucket,
        region: s3Config.region,
        size: buffer.length,
        mimeType: fileInfo.mimeType,
        etag: response.ETag,
        versionId: response.VersionId
      };
    } catch (error) {
      console.error('❌ Large file upload error:', error);
      throw new Error(`Failed to upload large file: ${error}`);
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key
      });

      await s3Client.send(command);
      console.log(`✅ File deleted: ${key}`);
    } catch (error) {
      console.error('❌ Delete file error:', error);
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  /**
   * Delete multiple files from S3
   */
  async deleteMultipleFiles(keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return;

      const command = new DeleteObjectsCommand({
        Bucket: s3Config.bucket,
        Delete: {
          Objects: keys.map(key => ({ Key: key })),
          Quiet: true
        }
      });

      await s3Client.send(command);
      console.log(`✅ Deleted ${keys.length} files`);
    } catch (error) {
      console.error('❌ Delete multiple files error:', error);
      throw new Error(`Failed to delete files: ${error}`);
    }
  }

  /**
   * Delete resource and its S3 files
   */
  async deleteResourceWithFiles(resourceId: string, deletedBy: string): Promise<void> {
    try {
      const resource = await Resource.findById(resourceId);

      if (!resource) {
        throw new Error('Resource not found');
      }

      const keysToDelete: string[] = [];

      // Add main file
      if (resource.s3?.key) {
        keysToDelete.push(resource.s3.key);
      }

      // Add thumbnail if exists
      if (resource.metadata?.thumbnailKey) {
        keysToDelete.push(resource.metadata.thumbnailKey);
      }

      // Delete from S3
      if (keysToDelete.length > 0) {
        await this.deleteMultipleFiles(keysToDelete);
      }

      // Soft delete in database
      await resource.softDelete(deletedBy);

      console.log(`✅ Resource and files deleted: ${resourceId}`);
    } catch (error) {
      console.error('❌ Delete resource error:', error);
      throw new Error(`Failed to delete resource: ${error}`);
    }
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: s3Config.bucket,
        Key: key
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      console.log(`✅ Signed URL generated for: ${key}`);
      return signedUrl;
    } catch (error) {
      console.error('❌ Get signed URL error:', error);
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }

  /**
   * Get file metadata from S3
   */
  async getFileMetadata(key: string): Promise<any> {
    try {
      const command = new HeadObjectCommand({
        Bucket: s3Config.bucket,
        Key: key
      });

      const response = await s3Client.send(command);

      return {
        size: response.ContentLength,
        mimeType: response.ContentType,
        lastModified: response.LastModified,
        etag: response.ETag,
        metadata: response.Metadata
      };
    } catch (error) {
      console.error('❌ Get file metadata error:', error);
      throw new Error(`Failed to get file metadata: ${error}`);
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.getFileMetadata(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Copy file within S3
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<string> {
    try {
      const command = new CopyObjectCommand({
        Bucket: s3Config.bucket,
        CopySource: `${s3Config.bucket}/${sourceKey}`,
        Key: destinationKey,
        ACL: 'public-read'
      });

      await s3Client.send(command);

      const url = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${destinationKey}`;
      console.log(`✅ File copied: ${sourceKey} -> ${destinationKey}`);

      return url;
    } catch (error) {
      console.error('❌ Copy file error:', error);
      throw new Error(`Failed to copy file: ${error}`);
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(prefix: string = '', maxKeys: number = 1000): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: s3Config.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys
      });

      const response = await s3Client.send(command);
      const files = response.Contents?.map(item => item.Key!) || [];

      console.log(`✅ Found ${files.length} files with prefix: ${prefix}`);
      return files;
    } catch (error) {
      console.error('❌ List files error:', error);
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  /**
   * Get total size of files for a user
   */
  async getUserStorageSize(userId: string): Promise<number> {
    try {
      const prefix = `uploads/`;
      const command = new ListObjectsV2Command({
        Bucket: s3Config.bucket,
        Prefix: prefix
      });

      const response = await s3Client.send(command);

      let totalSize = 0;
      response.Contents?.forEach(item => {
        if (item.Key?.includes(userId)) {
          totalSize += item.Size || 0;
        }
      });

      return totalSize;
    } catch (error) {
      console.error('❌ Get user storage size error:', error);
      return 0;
    }
  }

  /**
   * Cleanup old files (older than X days)
   */
  async cleanupOldFiles(days: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const command = new ListObjectsV2Command({
        Bucket: s3Config.bucket,
        Prefix: 'uploads/'
      });

      const response = await s3Client.send(command);
      const oldFiles = response.Contents?.filter(item =>
        item.LastModified && item.LastModified < cutoffDate
      ).map(item => item.Key!) || [];

      if (oldFiles.length > 0) {
        await this.deleteMultipleFiles(oldFiles);
      }

      console.log(`✅ Cleaned up ${oldFiles.length} old files`);
      return oldFiles.length;
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      return 0;
    }
  }

  /**
   * Check if file is an image
   */
  private isImage(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number, maxSize: number = 100 * 1024 * 1024): boolean {
    return size <= maxSize; // Default 100MB
  }

  /**
   * Validate file type
   */
  validateFileType(filename: string, allowedTypes: string[]): boolean {
    const ext = path.extname(filename).toLowerCase();
    return allowedTypes.includes(ext);
  }
}

// Export singleton instance
export const s3Service = new S3Service();
export default s3Service;