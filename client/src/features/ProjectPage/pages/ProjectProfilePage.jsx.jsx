import React, { useState } from "react";
import {
  ClipboardList,
  Activity,
  MessageSquare,
  Users,
  Tag,
  Folder,
  Github,
  Share2,
} from "lucide-react";
import { projectProfileApi } from "../api/projectProfileApi";
import AssignTaskButton from "../components/AssignTaskButton";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import MilestoneItem from "../components/MilestoneItem";
import CommentItem from "../components/CommentItem";
import TeamMemberItem from "../components/TeamMemberItem";
import DocumentItem from "../components/DocumentItem";
import EditProjectButton from "../components/EditProjectButton";

export default function ProjectProfilePage() {
  const projectData = projectProfileApi.getProjectProfile();
  const [project, setProject] = useState(projectData);
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;

  const [role, setRole] = useState("leader");
  const currentUser = { name: "Riya Infinity", role };

  const handleProjectUpdate = (updatedData) => {
    setProject((prev) => ({
      ...prev,
      ...updatedData,
      teamMembers: updatedData.members || prev.teamMembers,
      tags: updatedData.tags
        ? updatedData.tags.split(",").map((t) => t.trim())
        : prev.tags,
    }));
  };

  // ✅ Comment writing state
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        name: currentUser.name,
        avatar: "https://placehold.co/40x40/blue/white?text=RI",
      },
      message: newComment.trim(),
      time: "Just now",
    };

    setProject((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));

    setNewComment("");
  };

  return (
    <div className="max-w-7xl mx-[20px] p-4 md:p-8">
      {/* Role toggle */}
      {/* <div className="flex justify-end mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-300 mr-2">
          Current Role:
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="text-sm bg-white dark:bg-[#222222] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#444] rounded px-2 py-1"
        >
          <option value="admin">Admin</option>
          <option value="leader">Leader</option>
          <option value="member">Member</option>
        </select>
      </div> */}

      <header className="flex flex-col md:flex-row justify-between mb-10">
        <div>
          <h1 className="text-3xl mb-6 text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <div className="flex items-center space-x-2 mt-2">
            <StatusBadge status={project.status} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              · ID: {project.id}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button icon={<Share2 />}>Share</Button>

          <AssignTaskButton
            currentUser={currentUser}
            project={project}
            onAssign={(task) => {
              alert(`Task "${task.title}" assigned to ${task.assignee}`);
            }}
          />

          <EditProjectButton
            currentUser={currentUser}
            project={project}
            onSave={handleProjectUpdate}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project Description" icon={<ClipboardList />}>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {project.description}
            </p>
          </Card>

          <Card title="Progress & Milestones" icon={<Activity />}>
            <div className="space-y-6">
              <ProgressBar progress={project.progress} />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completedTasks} / {totalTasks} tasks completed.
              </p>
              <ul className="space-y-3">
                {project.milestones.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </ul>
            </div>
          </Card>

          {/* ✅ Updated Comments Section */}
          <Card title="Recent Activity" icon={<MessageSquare />}>
  {/* Scrollable, hidden scrollbar */}
  <div
    className="divide-y divide-gray-200 dark:divide-[#222222] mb-4 max-h-72 overflow-y-auto scrollbar-hide"
    style={{
      msOverflowStyle: "none", // for Internet Explorer and Edge
      scrollbarWidth: "none", // for Firefox
    }}
  >
    <style>
      {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* for Chrome, Safari, and Opera */
        }
      `}
    </style>

    {project.comments.map((comment) => (
      <CommentItem key={comment.id} comment={comment} />
    ))}
  </div>

  <div className="border-t border-gray-200 dark:border-[#333] pt-3">
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
</Card>

        </div>

        <div className="space-y-6">
          <Card title="Team" icon={<Users />}>
            <div className="space-y-4">
              {project.teamMembers.map((m, index) => (
                <TeamMemberItem key={index} member={m} />
              ))}
            </div>
          </Card>

          <Card title="Tags" icon={<Tag />}>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-[#222222] text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>

          <Card title="Documents" icon={<Folder />}>
            <div className="divide-y divide-gray-200 dark:divide-[#222222]">
              {project.documents.map((d) => (
                <DocumentItem key={d.name} doc={d} />
              ))}
            </div>
          </Card>

          <Card title="Repository" icon={<Github />}>
            <a
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
