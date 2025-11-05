import React from "react";
import Button from "./Button";
import { Check, X } from "lucide-react";

export default function CommentItem({ comment }) {
  return (
    <div className="flex items-start space-x-3 py-4 first:pt-0 last:pb-0">
      <img
        src={comment.user.avatar}
        alt={comment.user.name}
        className="w-9 h-9 rounded-full"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {comment.user.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {comment.time}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
          {comment.message}
        </p>
        {comment.type === "access-request" && (
          <div className="mt-3 bg-gray-50 dark:bg-[#222222] p-3 rounded-md border border-gray-200 dark:border-[#333333]">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Access Request: <span className="font-normal">{comment.file}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Role: {comment.role}
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="success" icon={<Check />} className="px-3 py-1 text-xs">
                Approve
              </Button>
              <Button variant="danger" icon={<X />} className="px-3 py-1 text-xs">
                Decline
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
