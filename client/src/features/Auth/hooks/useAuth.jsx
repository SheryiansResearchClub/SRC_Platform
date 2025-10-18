import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  signupUser,
  forgotUserPassword,
  resetUserPassword,
  oauthLoginUser,
} from "../slice/authSlice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  // Thunks wrapped with navigation
  const login = async (data) => {
    const result = await dispatch(loginUser(data));
    if (result.meta.requestStatus === "fulfilled") navigate("/dashboard");
  };

  const signup = async (data) => {
    const result = await dispatch(signupUser(data));
    if (result.meta.requestStatus === "fulfilled") navigate("/dashboard");
  };

  const forgotPassword = async (data) => {
    await dispatch(forgotUserPassword(data));
  };

  const resetPassword = async (data) => {
    await dispatch(resetUserPassword(data));
  };

  const oauthLogin = async (provider) => {
    const result = await dispatch(oauthLoginUser({ provider }));
    if (result.meta.requestStatus === "fulfilled") navigate("/dashboard");
  };

  return {
    ...authState, // loading, error, message, user, tokens
    login,
    signup,
    forgotPassword,
    resetPassword,
    oauthLogin,
  };
};
