import React from 'react'
import ThemeContext from '@/context/ThemeContext'
import { ResourceIcon } from './icons/ResourceIcon'
import { PlayCircle, Download } from 'lucide-react'
import { useContext } from 'react'

const Resources = () => {
  const iconColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
  const {dark} = useContext(ThemeContext)

  const resources = [
    {
      id: 1,
      name: "Introduction to React",
      author: "Dan Abramov",
      type: "vid", // shows Play button
      url: "https://example.com/react-intro"
    },
    {
      id: 2,
      name: "Advanced JavaScript Guide",
      author: "Kyle Simpson",
      type: "pdf", // shows Download button
      url: "https://example.com/js-guide"
    },
    {
      id: 3,
      name: "Tailwind CSS Basics",
      author: "Sarah Drasner",
      type: "vid",
      url: "https://example.com/tailwind-basics"
    },
    {
      id: 4,
      name: "Node.js Cheatsheet",
      author: "Ryan Dahl",
      type: "pdf",
      url: "https://example.com/node-cheatsheet"
    },
    {
      id: 5,
      name: "UI Design Principles",
      author: "Adam Wathan",
      type: "pdf",
      url: "https://example.com/ui-design"
    }
  ];
  

  return (
    <div className="">
      <h1 className='text-2xl mb-7 '>Resource Library</h1>
      <div className='flex gap-5 flex-wrap'>
      {resources.map((resource, index) => (
        <div
          key={resource.id || index}
          className={`flex-shrink-0 w-56 p-2.5 rounded-xl shadow-sm border transition-colors duration-300 ${
            dark
              ? "bg-[#2f2f2f] border-[#555555] hover:bg-[#252525]"
              : "bg-white border-gray-100 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-2 mb-1">
            <ResourceIcon
              type={resource.type}
              color={iconColors[index % iconColors.length]}
            />
            <div>
              <div
                className={`font-medium text-sm ${
                  dark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {resource.name}
              </div>
              <div
                className={`text-xs ${
                  dark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {resource.author}
              </div>
            </div>
          </div>

          {resource.type === "vid" ? (
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90"
              style={{
                backgroundColor: iconColors[index % iconColors.length],
                color: "#fff",
              }}
            >
              <PlayCircle size={14} />
            </button>
          ) : (
            <button
              className="hover:opacity-80"
              style={{ color: iconColors[index % iconColors.length] }}
            >
              <Download size={18} />
            </button>
          )}
        </div>
      ))}

      </div>
    </div>
  )
}

export default Resources
