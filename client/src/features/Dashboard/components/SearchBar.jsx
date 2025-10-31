import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mt-5">
      <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      <input
        value={value}
        onChange={onChange}
        placeholder="Search projects..."
        className="bg-[#111315] text-white pl-10 pr-4 py-2 rounded-lg w-[50vw] outline-none border border-gray-800 focus:border-gray-600"
      />
    </div>
  );
}
