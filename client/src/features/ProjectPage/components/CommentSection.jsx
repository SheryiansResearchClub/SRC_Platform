import React, { useState } from "react";
import CommentItem from "./CommentItem";
import Button from "./Button";

export default function CommentsSection({ currentUser }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://placehold.co/40x40",
      },
      message: "Looks good to me!",
      time: "2h ago",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        name: currentUser?.name || "You",
        avatar: currentUser?.avatar || "https://placehold.co/40x40",
      },
      message: newComment.trim(),
      time: "Just now",
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-[#1a1a1a] rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Comments</h3>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 dark:border-[#333] pt-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full text-sm bg-gray-50 dark:bg-[#222] border border-gray-300 dark:border-[#444] rounded-md p-2 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={2}
        />
        <div className="flex justify-end mt-2">
          <Button
            variant="primary"
            className="px-4 py-1 text-sm"
            onClick={handleAddComment}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
