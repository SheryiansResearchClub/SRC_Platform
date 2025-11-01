import React from "react";

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center space-x-4 py-3">
    <Icon className="w-5 h-5 text-zinc-400 flex-shrink-0" />
    <span className="text-sm text-zinc-400 font-medium w-28 flex-shrink-0">
      {label}
    </span>
    <div className="text-zinc-200 text-sm flex items-center flex-1">
      {children}
    </div>
  </div>
);

export default DetailRow;
