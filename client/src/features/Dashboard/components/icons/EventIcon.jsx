import React from 'react';
import { MessageSquare, Video } from 'lucide-react';

export const EventIcon = ({ type }) => {
  if (type === 'discord') return <div className="w-8 h-8 rounded-lg bg-[#B4DA00] flex items-center justify-center text-white"><MessageSquare size={16} /></div>;
  if (type === 'meet') return <div className="w-8 h-8 rounded-lg bg-[#B4DA00] flex items-center justify-center text-white"><Video size={16} /></div>;
  return null;
};
