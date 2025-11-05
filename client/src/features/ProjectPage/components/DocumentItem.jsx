import React from "react";
import Button from "./Button";
import { FileText, Archive, Download } from "lucide-react";

export default function DocumentItem({ doc }) {
  const icon =
    doc.type === "pdf" ? (
      <FileText className="w-6 h-6 text-red-500" />
    ) : (
      <Archive className="w-6 h-6 text-yellow-500" />
    );
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {doc.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Uploaded by {doc.uploadedBy}
          </p>
        </div>
      </div>
      <Button variant="ghost" icon={<Download />} className="px-2 py-2 text-xs" />
    </div>
  );
}
