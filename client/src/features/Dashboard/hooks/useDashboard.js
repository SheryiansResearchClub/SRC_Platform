import { useState, useEffect } from "react";
import { projectsData } from "../api/dashboardMockApi";


export const useDashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(projectsData);
  }, []);
  return data;
};
