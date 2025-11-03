import React, { useContext, useRef, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import { MdEdit } from "react-icons/md";
import { FaGithub, FaLinkedin, FaDribbble } from "react-icons/fa";

const MemberProfilePage = () => {
  const { dark } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [member, setMember] = useState({
    name: "Aayush Garg",
    role: "Creative Developer",
    bio: "Building immersive experiences that combine design, code, and motion. Focused on modern UI, creative development, and 3D web design.",
    email: "aayush@sheryians.club",
    location: "Bhopal, India",
    joined: "June 2024",
    skills: ["React", "Three.js", "GSAP", "UI/UX", "Framer Motion"],
    teams: ["Frontend Guild", "Design Squad"],
    stats: {
      completed: 8,
      inProgress: 2,
      teams: 2,
    },
    socials: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      dribbble: "https://dribbble.com/",
    },
    activity: [
      { icon: "🚀", text: "Deployed 3D Landing Page", date: "Oct 30, 2025" },
      { icon: "🎨", text: "Improved club dashboard design", date: "Oct 25, 2025" },
      { icon: "🧠", text: "Collaborated with Design Squad", date: "Oct 10, 2025" },
    ],
  });

  const [formData, setFormData] = useState(member);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleEdit = () => {
    setFormData(member);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMember(formData);
    setIsEditing(false);
  };

  return (
    <main
      className={`min-h-screen flex justify-center items-start py-8 px-4 sm:px-8 ${
        dark ? "bg-[#0B0D0E] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-6xl rounded-3xl p-6 sm:p-10 shadow-2xl border relative transition-all duration-300 ${
          dark
            ? "bg-[#121212] border-[#1a2134] shadow-[0_0_30px_rgba(0,132,255,0.15)]"
            : "bg-white border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className={`absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-xl shadow-md transition-all ${
            dark
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          <MdEdit size={16} />
          Edit
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 border-b border-gray-800/40 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group self-center sm:self-auto">
              <img
                src={
                  avatar ||
                  "https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                }
                alt="Avatar"
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-2 border-gray-500/30 shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-gray-500 text-white p-2 rounded-full shadow-md hover:bg-gray-600 active:scale-95 transition-all"
              >
                <MdEdit size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {member.name}
              </h2>
              <p className="text-gray-400 font-medium mt-1 text-sm sm:text-base">
                {member.role}
              </p>
              <p
                className={`mt-3 leading-relaxed text-sm sm:text-base ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {member.bio}
              </p>

              <div className="mt-3 space-y-1 text-xs sm:text-sm text-gray-500">
                <p>📍 {member.location}</p>
                <p>📧 {member.email}</p>
                <p>🕓 Joined {member.joined}</p>
              </div>

              {/* Socials */}
              <div className="flex justify-center sm:justify-start gap-4 mt-4 text-xl sm:text-2xl">
                <a href={member.socials.github} target="_blank" rel="noreferrer">
                  <FaGithub className="hover:text-gray-400 transition-colors duration-200" />
                </a>
                <a href={member.socials.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin className="hover:text-gray-400 transition-colors duration-200" />
                </a>
                <a href={member.socials.dribbble} target="_blank" rel="noreferrer">
                  <FaDribbble className="hover:text-gray-400 transition-colors duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-5 text-gray-300">
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: member.stats.completed, label: "Projects Completed", color: "text-green-400" },
              { value: member.stats.inProgress, label: "In Progress", color: "text-yellow-400" },
              { value: member.stats.teams, label: "Teams Joined", color: "text-teal-400" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900/30 to-gray-700/10 rounded-2xl p-6 border border-gray-700/40 text-center shadow-inner hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>{stat.value}</h4>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Skills</h3>
          <div className="flex flex-wrap gap-3">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  dark
                    ? "bg-gray-900/30 text-gray-300 border border-gray-700/40 hover:bg-gray-800"
                    : "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Teams */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Teams</h3>
          <div className="flex flex-wrap gap-3">
            {member.teams.map((team) => (
              <div
                key={team}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  dark
                    ? "bg-[#2e2e2e] border border-gray-800/40 hover:bg-gray-800"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {team}
              </div>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section className="mt-12 border-t border-gray-900/30 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Recent Activity</h3>
          <ul className={`space-y-4 ${dark ? "text-gray-400" : "text-gray-600"} text-sm`}>
            {member.activity.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-200"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p>{item.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 overflow-y-auto">
            <form
              onSubmit={handleSave}
              className={`p-6 sm:p-8 rounded-2xl w-[90%] max-w-lg my-10 ${
                dark ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

              {["name", "role", "email", "location"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full mb-3 p-2 rounded-md border border-gray-500/30 bg-transparent text-sm"
                />
              ))}

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Bio"
                className="w-full mb-5 p-2 rounded-md border border-gray-500/30 bg-transparent text-sm"
              ></textarea>

              <div className="flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md bg-gray-500/40 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default MemberProfilePage;
