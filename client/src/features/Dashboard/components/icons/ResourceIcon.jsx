import React from 'react';
import { FileType2, FolderArchive, Video } from 'lucide-react';

export const ResourceIcon = ({ type }) => {
  switch (type) {
    case 'pdf': return <FileType2 size={20} className="text-[#B4DA00]" />;
    case 'zip': return <FolderArchive size={20} className="text-[#B4DA00]" />;
    case 'doc': return <FileType2 size={20} className="text-[#B4DA00]" />;
    case 'vid': return <Video size={20} className="text-[#B4DA00]" />;
    default: return <FileType2 size={20} className="text-gray-500" />;
  }
};
