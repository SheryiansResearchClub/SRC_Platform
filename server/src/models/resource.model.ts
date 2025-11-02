import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    uploader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['tutorial', 'document', 'snippet', 'reference', 'tool', 'image', 'video', 'audio', 'other'],
      required: true,
      index: true
    },

    // S3 Storage Fields - CRITICAL
    s3: {
      key: {
        type: String,
        index: true,
      },
      bucket: {
        type: String,
        default: process.env.AWS_BUCKET_NAME || 'src-static-file'
      },
      region: {
        type: String,
        default: process.env.AWS_REGION || 'ap-south-1'
      },
      url: {
        type: String,
      },
      size: {
        type: Number,
        min: 0,
        max: 104857600 // 100MB max
      },
      mimeType: {
        type: String,
        required: function () { return !this.isExternal as any; }
      },
      etag: String, // S3 ETag for integrity checking
      versionId: String, // If versioning is enabled
    },

    // External Resources (YouTube, GitHub, etc.)
    externalUrl: {
      type: String,
      required: function () { return this.isExternal; },
      validate: {
        validator: function (v: string) {
          if (!this.isExternal) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Invalid external URL'
      }
    },
    isExternal: {
      type: Boolean,
      default: false,
      index: true
    },

    // Metadata
    metadata: {
      originalName: String, // Original filename
      extension: String, // .pdf, .docx, etc.
      width: Number, // For images/videos
      height: Number, // For images/videos
      duration: Number, // For audio/video in seconds
      pageCount: Number, // For PDFs
    },

    // Tags & Search
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 50
    }],

    // Engagement Metrics
    stats: {
      downloads: {
        type: Number,
        default: 0,
        min: 0
      },
      views: {
        type: Number,
        default: 0,
        min: 0
      },
      shares: {
        type: Number,
        default: 0,
        min: 0
      }
    },

    // Social Features
    likes: {
      count: {
        type: Number,
        default: 0,
        min: 0
      },
      users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }]
    },

    // Moderation
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'approved',
      index: true
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    moderationNote: String,

    // Visibility
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },

    // Access Control (Optional)
    allowedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    requireAuth: {
      type: Boolean,
      default: false
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: Date,
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound Indexes for Better Performance
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ResourceSchema.index({ category: 1, featured: 1, 'stats.downloads': -1 });
ResourceSchema.index({ uploader: 1, status: 1, isDeleted: 1 });
ResourceSchema.index({ status: 1, visibility: 1, isDeleted: 1 });
ResourceSchema.index({ 's3.key': 1 }, { unique: true, sparse: true });
ResourceSchema.index({ createdAt: -1 });
ResourceSchema.index({ tags: 1, category: 1 });

// Virtual: Get full S3 URL
ResourceSchema.virtual('fileUrl').get(function () {
  if (this.isExternal) {
    return this.externalUrl;
  }
  if (this.s3?.key) {
    return `https://${this.s3.bucket}.s3.${this.s3.region}.amazonaws.com/${this.s3.key}`;
  }
  return null;
});

// Virtual: Check if user liked
ResourceSchema.virtual('isLikedByUser').get(function () {
  // Will be set dynamically in your API
  return false;
});

// Instance Methods
ResourceSchema.methods = {
  // Increment download count
  incrementDownloads: async function () {
    this.stats.downloads += 1;
    return this.save();
  },

  // Increment view count
  incrementViews: async function () {
    this.stats.views += 1;
    return this.save();
  },

  // Toggle like
  toggleLike: async function (userId: any) {
    const index = this.likes.users.indexOf(userId);
    if (index > -1) {
      this.likes.users.splice(index, 1);
      this.likes.count = Math.max(0, this.likes.count - 1);
    } else {
      this.likes.users.push(userId);
      this.likes.count += 1;
    }
    return this.save();
  },

  // Soft delete
  softDelete: async function (userId: any) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
  },

  // Get signed URL (for private files)
  getSignedUrl: async function (expiresIn: number = 3600) {
    if (this.isExternal || !this.s3?.key) {
      return this.fileUrl;
    }
    // Import S3Service here or pass it as parameter
    // const s3Service = new S3Service();
    // return s3Service.getSignedUrl(this.s3.key, expiresIn);
    return this.fileUrl; // Fallback to public URL
  }
};

// Static Methods
ResourceSchema.statics = {
  // Find public resources
  findPublic: function (filters = {}) {
    return this.find({
      ...filters,
      status: 'approved',
      visibility: 'public',
      isDeleted: false
    });
  },

  // Find by category
  findByCategory: function (category: string, limit = 10) {
    return this.find({
      category,
      status: 'approved',
      visibility: 'public',
      isDeleted: false
    })
      .sort({ 'stats.downloads': -1, createdAt: -1 })
      .limit(limit)
      .populate('uploader', 'name email avatar');
  },

  // Search resources
  searchResources: function (query: string, filters = {}) {
    return this.find({
      $text: { $search: query },
      ...filters,
      status: 'approved',
      visibility: 'public',
      isDeleted: false
    })
      .sort({ score: { $meta: 'textScore' } })
      .populate('uploader', 'name email avatar');
  },

  // Get trending resources
  getTrending: function (days = 7, limit = 10) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.find({
      status: 'approved',
      visibility: 'public',
      isDeleted: false,
      createdAt: { $gte: date }
    })
      .sort({ 'stats.downloads': -1, 'stats.views': -1 })
      .limit(limit)
      .populate('uploader', 'name email avatar');
  }
};

// Pre-save middleware
ResourceSchema.pre('save', function (next) {
  // Auto-generate S3 URL if key exists
  if (this.s3?.key && !this.s3.url) {
    this.s3.url = `https://${this.s3.bucket}.s3.${this.s3.region}.amazonaws.com/${this.s3.key}`;
  }

  // Normalize tags
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase().trim()))];
  }

  next();
});

// Pre-remove middleware - Delete from S3
ResourceSchema.pre('deleteOne', { document: true, query: false }, async function () {
  if (this.s3?.key && !this.isExternal) {
    // Import and use S3Service to delete file
    // const s3Service = new S3Service();
    // await s3Service.deleteFile(this.s3.key);
    console.log(`Should delete S3 file: ${this.s3.key}`);
  }
});

// Define interface for instance methods
interface IResourceMethods {
  incrementViews(): Promise<void>;
  incrementDownloads(): Promise<void>;
  toggleLike(userId: any): Promise<void>;
  softDelete(userId: any): Promise<void>;
  getSignedUrl(expiresIn?: number): Promise<string>;
}

// Create a type that combines the schema type and instance methods
type ResourceType = InferSchemaType<typeof ResourceSchema> & IResourceMethods;

// Create the document type that includes the instance methods
type ResourceDocument = HydratedDocument<InferSchemaType<typeof ResourceSchema>> & IResourceMethods;

export { ResourceDocument, ResourceType };

// Update the model to include the instance methods
export const Resource = model<InferSchemaType<typeof ResourceSchema>, any>('Resource', ResourceSchema);