import React from "react";

const Tag = ({ children, className }) => (
  <span className={`text-xs font-medium px-3 py-1 rounded-md ${className}`}>
    {children}
  </span>
);

export default Tag;
