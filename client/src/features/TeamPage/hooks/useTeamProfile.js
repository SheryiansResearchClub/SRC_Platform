// features/TeamPage/hooks/useTeamProfile.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamById } from "../slice/teamProfileSlice";

export const useTeamProfile = (id) => {
  const dispatch = useDispatch();
  const { team, loading, error } = useSelector((state) => state.teamProfile);

  useEffect(() => {
    if (id) dispatch(fetchTeamById(id));
  }, [dispatch, id]);

  return { team, loading, error };
};
