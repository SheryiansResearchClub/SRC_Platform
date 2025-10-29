import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectProfile } from "../slice/projectProfileSlice";

export const useProjectProfile = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.projectProfile);

  // ---------------------------
  // NEW: add user role handling
  // ---------------------------
  const [role, setRole] = useState("member"); // default user role

  useEffect(() => {
    // TEMP: manually switch role here for testing
    const mockRole = "admin"; // "admin" | "leader" | "member"
    setRole(mockRole);

    // BACKEND READY:
    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //   const { role } = JSON.parse(storedUser);
    //   setRole(role || "member");
    // }
  }, []);
  // ---------------------------

  useEffect(() => {
    dispatch(fetchProjectProfile());
  }, [dispatch]);

  // return everything like before + role
  return { data, loading, error, role };
};
