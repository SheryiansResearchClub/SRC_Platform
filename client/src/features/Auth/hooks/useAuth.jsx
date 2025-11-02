import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  oauthLogin,
  logout as logoutRequest,
} from "@/features/auth/api/authApi";
import {
  setAuthState,
  setAuthError,
  setAuthMessage,
  clearAuthFeedback,
  logout as logoutAction,
} from "@/features/auth/slices/authSlice";

const getErrorMessage = (error) =>
  error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "Something went wrong";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const handleAuthSuccess = ({ user, message }) => {
    if (user) {
      dispatch(setAuthState({ user, message }));
      return;
    }
    if (message) {
      dispatch(setAuthMessage(message));
    }
  };

  const handleError = (error) => {
    dispatch(setAuthError(getErrorMessage(error)));
  };

  const loginMutation = useMutation({
    mutationFn: (payload) => login(payload),
    onMutate: () => dispatch(clearAuthFeedback()),
    onSuccess: (response) => {
      const payloadData = response.data?.data ?? response.data;
      const { user, message } = payloadData ?? {};
      handleAuthSuccess({ user, message: message ?? "Login successful" });
      navigate("/dashboard");
    },
    onError: handleError,
  });

  const signupMutation = useMutation({
    mutationFn: (payload) => signup(payload),
    onMutate: () => dispatch(clearAuthFeedback()),
    onSuccess: (response) => {
      const payloadData = response.data?.data ?? response.data;
      const { user, message } = payloadData ?? {};
      handleAuthSuccess({ user, message: message ?? "Signup successful" });
      navigate("/dashboard");
    },
    onError: handleError,
  });

  const forgotMutation = useMutation({
    mutationFn: (payload) => forgotPassword(payload),
    onMutate: () => dispatch(clearAuthFeedback()),
    onSuccess: (response) => {
      const message = response.data?.data?.message || response.data?.message;
      dispatch(setAuthMessage(message));
    },
    onError: handleError,
  });

  const resetMutation = useMutation({
    mutationFn: (payload) => resetPassword(payload),
    onMutate: () => dispatch(clearAuthFeedback()),
    onSuccess: (response) => {
      const message = response.data?.data?.message || response.data?.message;
      dispatch(setAuthMessage(message));
    },
    onError: handleError,
  });

  const oauthLoginHandler = (provider) => {
    dispatch(clearAuthFeedback());
    oauthLogin(provider);
  };

  const logoutMutation = useMutation({
    mutationFn: () => logoutRequest(),
    onMutate: () => dispatch(clearAuthFeedback()),
    onSuccess: (response) => {
      const message = response.data?.data?.message || response.data?.message;
      dispatch(logoutAction());
      if (message) {
        dispatch(setAuthMessage(message));
      }
    },
    onError: handleError,
  });

  return {
    ...authState,
    login: (data) => loginMutation.mutate(data),
    signup: (data) => signupMutation.mutate(data),
    forgotPassword: (data) => forgotMutation.mutate(data),
    resetPassword: (data) => resetMutation.mutate(data),
    oauthLogin: oauthLoginHandler,
    logout: () => logoutMutation.mutate(),
    clearFeedback: () => dispatch(clearAuthFeedback()),
    isAuthenticating: loginMutation.isPending || signupMutation.isPending,
    isForgotPending: forgotMutation.isPending,
    isResetPending: resetMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    loginStatus: loginMutation.status,
    signupStatus: signupMutation.status,
    forgotStatus: forgotMutation.status,
    resetStatus: resetMutation.status,
  };
};
