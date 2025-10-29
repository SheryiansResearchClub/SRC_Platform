import React from "react";
import { Home, Grid, FileText, Settings } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: "Home" },
    { icon: Grid, label: "Dashboard", active: true },
    { icon: FileText, label: "Projects" },
  ];

  return (
    <nav className="w-20 bg-[#111111] text-zinc-400 flex flex-col items-center py-6 space-y-10 h-screen sticky top-0">
      <img
        src="https://placehold.co/40x40/111111/ffffff?text=LOGO&font=inter"
        alt="Logo"
        className="w-10 h-10 rounded-lg"
      />
      <div className="flex flex-col space-y-6 items-center">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`p-3 rounded-lg ${
              item.active ? "bg-zinc-800 text-white" : "hover:bg-zinc-800"
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>
      <div className="mt-auto">
        <button className="p-3 rounded-lg hover:bg-zinc-800" title="Settings">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
