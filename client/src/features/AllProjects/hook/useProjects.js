import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  selectAllProjects,
  selectProjectsLoading,
  selectProjectsError,
} from "../slice/projectSlice";

/**
 * Custom hook to manage project data fetching and state.
 * @returns {{projects: Array<Object>, loading: string, error: string|null}}
 */
export const useProjectData = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectAllProjects);
  const loading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);

  useEffect(() => {
    // Only fetch projects if the state is 'idle'
    if (loading === "idle") {
      dispatch(fetchProjects());
    }
  }, [loading, dispatch]);

  return { projects, loading, error };
};
