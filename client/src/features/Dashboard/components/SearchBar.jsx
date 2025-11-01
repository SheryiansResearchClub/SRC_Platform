import React, { useState, useRef, useEffect } from "react";

// --- START INLINE ICONS ---
// Replaced react-icons/fi with inline SVGs to fix build error

const FiSearch = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FiChevronDown = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const FiUser = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const FiUsers = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FiBriefcase = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
const FiCalendar = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const FiClock = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const FiFolder = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);
// --- END INLINE ICONS ---

// --- useOnClickOutside Hook ---
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// --- DropdownMenu Helper ---
const DropdownMenu = ({ options, onSelect, iconMap = {} }) => (
  <div className="absolute right-0 mt-2 w-56 bg-[#1f2328] border border-gray-800 rounded-lg shadow-lg z-20">
    <ul className="py-1 max-h-60 overflow-y-auto">
      {options.map((optionLabel) => (
        <li
          key={optionLabel}
          onClick={() => onSelect(optionLabel)}
          className="flex items-center px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
        >
          {iconMap[optionLabel] || iconMap["default"]}
          {optionLabel}
        </li>
      ))}
    </ul>
  </div>
);

// --- 1. UPDATED PROPS LIST ---
// Added `canSeeAllUsers` and default `[]` values to prevent crashes
export default function SearchBar({
  value,
  onChange,
  allProjectNames = [], // <-- NEW
  selectedProject,      // <-- NEW
  onProjectChange,        // <-- NEW
  allUserNames = [], // Renamed from allUsers, added default
  selectedUser,
  onUserChange,
  canSeeAllUsers,  // The new permission prop
  allTeams = [],       // Added default
  selectedTeam,
  onTeamChange,
  dateOptions = [],    // Added default
  selectedDate,
  onDateChange,
  statusOptions = [],  // Added default
  selectedStatus,
  onStatusChange,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownsRef = useRef(null);

  useOnClickOutside(dropdownsRef, () => setOpenDropdown(null));

  const handleToggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // --- Handlers (no changes) ---
  const handleUserSelect = (label) => {
    onUserChange(label);
    setOpenDropdown(null);
  };

  // --- Handlers ---
  const handleProjectSelect = (label) => { // <-- NEW
    onProjectChange(label);
    setOpenDropdown(null);
  };

  
  const handleTeamSelect = (label) => {
    onTeamChange(label);
    setOpenDropdown(null);
  };
  const handleDateSelect = (label) => {
    onDateChange(label);
    setOpenDropdown(null);
  };
  const handleStatusSelect = (label) => {
    onStatusChange(label);
    setOpenDropdown(null);
  };

  // --- 2. UPDATED ICON MAPS ---
  const userIconMap = {
    "All Users": <FiUsers className="mr-2 w-4 h-4" />,
    "My Projects": <FiUser className="mr-2 w-4 h-4" />, // Added this
    "default": <FiUser className="mr-2 w-4 h-4" />
  };
  const teamIconMap = {
    "All Teams": <FiBriefcase className="mr-2 w-4 h-4" />,
    "default": <FiBriefcase className="mr-2 w-4 h-4" />
  };
  const dateIconMap = { "default": <FiCalendar className="mr-2 w-4 h-4" /> };
  const statusIconMap = { "default": <FiClock className="mr-2 w-4 h-4" /> };
  
  // --- 3. CREATE FINAL USER OPTIONS LIST ---
  // This is now safe because allUserNames defaults to []
  const userDropdownOptions = ["All Users", "My Projects", ...allUserNames];
  
  // (Removed unused 'userOptions' and 'teamOptions' variables)

  return (
    <div className="relative mt-5 flex w-full items-center space-x-2">
      {/* Search Input (no change) */}
      <div className="relative flex-grow">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          value={value}
          onChange={onChange}
          placeholder="Search projects..."
          className="bg-[#111315] text-white pl-10 pr-4 py-2.5 rounded-lg w-full outline-none border border-gray-800 focus:border-gray-600 focus:z-10"
        />
      </div>

      {/* --- Wrapper for all dropdowns --- */}
      <div className="flex items-center space-x-2" ref={dropdownsRef}>
        
        {/* --- 4. ADDED PERMISSION CHECK --- */}
        {/* This dropdown is now only shown if the user has permission */}
        {canSeeAllUsers && (
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('users')}
              className="flex items-center justify-between bg-[#1f2328] text-white px-4 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-700"
            >
              <span className="mr-2">{selectedUser}</span>
              <FiChevronDown className={`w-4 h-4 ${openDropdown === 'users' ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === 'users' && (
               <DropdownMenu 
                 options={userDropdownOptions} // 5. Use the correct options list
                 onSelect={handleUserSelect} 
                 iconMap={userIconMap} 
               />
            )}
          </div>
        )}

        {/* Team Dropdown (no change) */}
        <div className="relative">
          <button
            onClick={() => handleToggleDropdown('teams')}
            className="flex items-center justify-between bg-[#1f2328] text-white px-4 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-700"
          >
            <span className="mr-2">{selectedTeam}</span>
            <FiChevronDown className={`w-4 h-4 ${openDropdown === 'teams' ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === 'teams' && (
             <DropdownMenu options={allTeams} onSelect={handleTeamSelect} iconMap={teamIconMap} />
          )}
        </div>

        {/* Date Dropdown (no change) */}
        <div className="relative">
          <button
            onClick={() => handleToggleDropdown('date')}
            className="flex items-center justify-between bg-[#1f2328] text-white px-4 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-700"
          >
            <span className="mr-2">{selectedDate}</span>
            <FiChevronDown className={`w-4 h-4 ${openDropdown === 'date' ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === 'date' && (
             <DropdownMenu options={dateOptions} onSelect={handleDateSelect} iconMap={dateIconMap} />
          )}
        </div>
        
        {/* Status Dropdown (no change) */}
        <div className="relative">
          <button
            onClick={() => handleToggleDropdown('status')}
            className="flex items-center justify-between bg-[#1f2328] text-white px-4 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-700"
          >
            <span className="mr-2">{selectedStatus}</span>
            <FiChevronDown className={`w-4 h-4 ${openDropdown === 'status' ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === 'status' && (
             <DropdownMenu options={statusOptions} onSelect={handleStatusSelect} iconMap={statusIconMap} />
          )}
        </div>

      </div>
    </div>
  );
}