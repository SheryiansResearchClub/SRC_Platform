import React, { useState, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";

const UserProfile = () => {
  const [active, setActive] = useState("profile");
  const [dark, setDark] = useState(true);
  const toggleTheme = () => setDark((prev) => !prev);
  const user = useSelector((state) => state.auth.user);

  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    jobTitle:
      user && typeof user.skills === "object"
        ? user.skills.join(", ")
        : user?.skills || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => { };

  const handleIconClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className={`w-full min-h-screen md:p-4 lg:p-5 transition-colors duration-300 ${dark ? "bg-[#121212] text-white" : "bg-[#fafafa] text-black"}`}>
      <Header dark={dark} toggleTheme={toggleTheme} />
      <Sidebar dark={dark} active={active} setActive={setActive} />
      <MobileMenu dark={dark} active={active} setActive={setActive} />

      <main className="mt-10 flex px-5 flex-col items-center md:ml-[8rem] md:mt-10 relative">
        <div className={`w-full max-w-3xl rounded-2xl shadow-lg p-8 transition-all duration-300 ${dark ? "bg-[#1b1b1b] border border-[#2e2e2e]" : "bg-white border border-gray-200"}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b pb-6">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left relative">
              <div className="relative flex items-end">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover shadow-md"
                />
                <button
                  onClick={handleIconClick}
                  className={`absolute bottom-1 right-1 p-1 rounded-full ${dark ? "bg-[#2b2b2b] hover:bg-[#3a3a3a]" : "bg-white hover:bg-gray-100"} shadow-md transition-all`}
                >
                  <MdEdit className="text-xl text-lime-400" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {user?.name && <h2 className="mt-4 text-2xl font-semibold">{user.name}</h2>}
              <p className={`text-sm mt-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {user?.email}
              </p>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(user?.skills) &&
                  user.skills.map((skill) => (
                    <span key={skill} className={`text-xs px-3 py-1 mt-2 rounded-full w-fit ${dark ? "bg-white/10 text-white" : "bg-lime-100 text-lime-700"}`}>
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            <div className="sm:self-start flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-lime-300 hover:bg-lime-400 text-black font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Update
              </button>
              <button className="bg-red-300 hover:bg-red-400 text-black font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
                Delete
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            {["name", "email", "jobTitle"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1 capitalize">
                  {key === "jobTitle" ? "Job Title" : key}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 text-sm outline-none transition-all ${dark ? "bg-[#232323] border-[#3b3b3b] focus:border-lime-400" : "bg-white border-gray-300 focus:border-lime-400"}`}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;