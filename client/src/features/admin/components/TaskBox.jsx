import React, { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";

const TaskBox = ({ dark, toggleTask }) => {
  // Example team and mentor data
  const teamMembers = [
    "Sagar Patel",
    "Aayush Gupta",
    "Meera Joshi",
    "Rohan Mehta",
    "Kritika Singh",
  ];

  const mentors = ["Harsh Sharma", "Vivek Rao", "Anjali Nair", "Kunal Verma"];

  // State management
  const [member, setMember] = useState("");
  const [mentor, setMentor] = useState("");
  const [date, setDate] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [showMemberSuggestions, setShowMemberSuggestions] = useState(false);
  const [showMentorSuggestions, setShowMentorSuggestions] = useState(false);

  // Handlers for member autocomplete
  const handleMemberChange = (e) => {
    const value = e.target.value;
    setMember(value);
    if (!value.trim()) {
      setFilteredMembers([]);
      setShowMemberSuggestions(false);
      return;
    }
    const filtered = teamMembers.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMembers(filtered);
    setShowMemberSuggestions(true);
  };

  const selectMember = (name) => {
    setMember(name);
    setShowMemberSuggestions(false);
  };

  // Handlers for mentor autocomplete
  const handleMentorChange = (e) => {
    const value = e.target.value;
    setMentor(value);
    if (!value.trim()) {
      setFilteredMentors([]);
      setShowMentorSuggestions(false);
      return;
    }
    const filtered = mentors.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMentors(filtered);
    setShowMentorSuggestions(true);
  };

  const selectMentor = (name) => {
    setMentor(name);
    setShowMentorSuggestions(false);
  };


  return (
    <div
      className={`fixed  top-[20%] w-[95%]  rounded-2xl p-8 border transition-all duration-500 z-50 md:right-2 md:w-[60%] lg:w-[40%] ${
        dark ? "bg-[#232323] border-[#373737]" : "bg-[#eeeeee] border-[#a8a8a8]"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`text-4xl font-semibold ${
            dark ? "text-[#aaaaaa]" : "text-[#444444]"
          }`}
        >
          Assign a Task
        </h1>
        <IoReturnUpBack  onClick={toggleTask}
          className={`cursor-pointer ${dark ? "text-[#aaaaaa]" : "text-[#444]"}`}
          size={24}
        />
      </div>

      {/* Form */}
      <form className="flex flex-col gap-8">
        {/* Team Member */}
        <div className="flex justify-between items-start relative">
          <label
            className={`text-lg ${
              dark ? "text-[#bcbcbc]" : "text-[#555]"
            }`}
          >
            To
          </label>
          <div className="relative w-[60%]">
            <input
              type="text"
              value={member}
              onChange={handleMemberChange}
              onFocus={() => member && setShowMemberSuggestions(true)}
              placeholder="Enter team member name"
              className={`w-full px-4 py-2 rounded-full outline-none text-sm transition-all ${
                dark
                  ? "bg-[#2e2e2e] text-[#bcbcbc] placeholder-[#6d6d6d]"
                  : "bg-[#ddd] text-[#444] placeholder-[#777]"
              }`}
            />
            {showMemberSuggestions && filteredMembers.length > 0 && (
              <ul
                className={`absolute mt-2 w-full rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto ${
                  dark ? "bg-[#2e2e2e]" : "bg-white border border-[#ccc]"
                }`}
              >
                {filteredMembers.map((name, i) => (
                  <li
                    key={i}
                    onClick={() => selectMember(name)}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      dark
                        ? "hover:bg-[#3a3a3a] text-[#bcbcbc]"
                        : "hover:bg-[#f1f1f1] text-[#333]"
                    }`}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex justify-between items-center">
          <label
            className={`text-lg ${
              dark ? "text-[#bcbcbc]" : "text-[#555]"
            }`}
          >
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`px-4 py-2 rounded-full text-sm outline-none w-[60%] ${
              dark
                ? "bg-[#2e2e2e] text-[#bcbcbc]"
                : "bg-[#ddd] text-[#444]"
            }`}
          />
        </div>

        {/* Mentor */}
        <div className="flex justify-between items-start relative">
          <label
            className={`text-lg ${
              dark ? "text-[#bcbcbc]" : "text-[#555]"
            }`}
          >
            Mentor
          </label>
          <div className="relative w-[60%]">
            <input
              type="text"
              value={mentor}
              onChange={handleMentorChange}
              onFocus={() => mentor && setShowMentorSuggestions(true)}
              placeholder="Enter mentor name"
              className={`w-full px-4 py-2 rounded-full outline-none text-sm transition-all ${
                dark
                  ? "bg-[#2e2e2e] text-[#bcbcbc] placeholder-[#6d6d6d]"
                  : "bg-[#ddd] text-[#444] placeholder-[#777]"
              }`}
            />
            {showMentorSuggestions && filteredMentors.length > 0 && (
              <ul
                className={`absolute mt-2 w-full rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto ${
                  dark ? "bg-[#2e2e2e]" : "bg-white border border-[#ccc]"
                }`}
              >
                {filteredMentors.map((name, i) => (
                  <li
                    key={i}
                    onClick={() => selectMentor(name)}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      dark
                        ? "hover:bg-[#3a3a3a] text-[#bcbcbc]"
                        : "hover:bg-[#f1f1f1] text-[#333]"
                    }`}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button className={`px-4 py-2 w-fit ml-[80%] border rounded-full  ${
                dark
                  ? "bg-[#2e2e2e] text-[#bcbcbc] placeholder-[#6d6d6d] hover:bg-[#484848]"
                  : "bg-[#ddd] text-[#444] placeholder-[#777] hover:bg-[#bbb]"
              }`}> Submit</button>
      </form>
    </div>
  );
};

export default TaskBox;
