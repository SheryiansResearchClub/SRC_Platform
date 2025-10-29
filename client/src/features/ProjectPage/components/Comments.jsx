import React, { useState } from "react";
import { MessageCircle, Send, MoveVertical } from "lucide-react";

const Comments = ({ comments, onAddComment, onDelete }) => {
  const [newComment, setNewComment] = useState("");
  const [isApproval, setIsApproval] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAdd = () => {
    if (!newComment.trim()) return;
    // The message is prefixed when 'isApproval' is true
    const message = isApproval ? `[Request Approval] ${newComment}` : newComment;
    onAddComment(message);
    setNewComment("");
    setIsApproval(false);
    setMenuOpen(false);
  };

  // Handles Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-[#262626] p-6 space-y-6 flex flex-col rounded-xl border border-zinc-800">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <MessageCircle size={18} /> Comments
      </h2>

      {/* Comment List */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {comments.map((comment) => {
          const isApprovalRequest = comment.message.startsWith("[Request Approval]");
          const displayMessage = isApprovalRequest
            ? comment.message.replace("[Request Approval]", "").trim()
            : comment.message;

          return (
            <div key={comment.id} className="flex items-start space-x-3 pt-4">
              <div className="relative">
                <img
                  className="w-9 h-9 rounded-full"
                  src={comment.user.avatar}
                  alt={comment.user.name}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm text-zinc-300">
                  <span className="font-bold text-white">{comment.user.name}</span>
                  <br />
                  {displayMessage}
                </p>

                {isApprovalRequest && (
                  <div className="mt-3">
                    <button
                      disabled
                      className="bg-zinc-700 text-zinc-400 text-sm font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                    >
                      Approval Requested
                    </button>
                  </div>
                )}
              </div>

              {comment.user.name === "You" && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex-shrink-0"
                >
                  {isApprovalRequest ? "Cancel" : "Delete"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comment Input Section */}
      <div className="mt-auto flex items-center gap-2 relative">
        <input
          type="text"
          placeholder={isApproval ? "Write your approval reason..." : "Write your comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-zinc-700 text-sm text-zinc-300 px-4 py-3 rounded-lg border border-zinc-600 focus:border-purple-500 focus:ring-0 outline-none"
        />

        {/* Three-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-zinc-400 hover:text-white px-2"
          >
            &#8942;
          </button>

          {menuOpen && (
            <div className="absolute bottom-12 right-0 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
              <button
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-zinc-700 ${
                  isApproval ? "text-purple-400" : "text-zinc-300"
                }`}
                onClick={() => {
                  setIsApproval((prev) => !prev);
                  setMenuOpen(false);
                }}
              >
                <MoveVertical size={16} className="text-zinc-400" />
                Request Approval
              </button>
            </div>
          )}
        </div>

        <button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Comments;
