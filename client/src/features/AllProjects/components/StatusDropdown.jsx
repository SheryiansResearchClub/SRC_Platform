import React, { useState, useEffect, useRef } from "react";
import ChevronDown from "./ChevronDown";

export default function StatusDropdown({
  selectedStatus,
  setSelectedStatus,
  statusOptions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[7rem] max-w-[10rem] px-4 py-2 bg-[#1c1d1f] text-gray-200 border border-[#2c2c2c] rounded-lg hover:bg-[#252628]"
      >
        <span className="truncate">{selectedStatus}</span>
        <ChevronDown
          size={14}
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[7rem] max-w-[10rem] bg-[#1c1d1f] border border-[#2c2c2c] rounded-lg shadow-lg z-20">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSelectedStatus(opt);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#252628]"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
