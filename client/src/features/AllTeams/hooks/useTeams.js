import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeams } from "../slice/teamSlice";

export const useTeams = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(getTeams());
  }, [dispatch]);

  return { list, loading, error };
};
