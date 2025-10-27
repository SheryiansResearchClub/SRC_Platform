import React from "react";
import useMediaQuery from "./hooks/useMediaQuery";
import DesktopDashboard from "./components/DesktopDashboard";
import MobileDashboard from "./components/MobileDashboard";


export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
}
