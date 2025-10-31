import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {

    const [dark, setDark] = useState(true)

    useEffect(() => {
        const savedTheme = localStorage.getItem("admin-theme");
        if (savedTheme) {
          setDark(JSON.parse(savedTheme)); 
        }
      }, []);
    
      
      useEffect(() => {
        localStorage.setItem("admin-theme", JSON.stringify(dark));
      }, [dark]);

      const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{dark, toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
