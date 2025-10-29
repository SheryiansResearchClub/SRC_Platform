import React from "react";
import { Bell, Sun } from "lucide-react";

const Header = () => (
  <header className="flex justify-between items-center p-4 border-b border-b-zinc-800">
    <span className="text-sm text-zinc-500">project page</span>
    <div className="flex items-center space-x-5">
      <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white">
        <Sun size={20} />
      </button>
      <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white">
        <Bell size={20} />
      </button>
      <img
        className="w-9 h-9 rounded-full"
        src="https://placehold.co/36x36/111111/ffffff?text=S"
        alt="User Avatar"
      />
    </div>
  </header>
);

export default Header;
