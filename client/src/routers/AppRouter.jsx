import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux"; // <-- 1. ADDED THIS IMPORT
import Home from "@/features/home/components/Home";
import HomeLayout from "@/layouts/HomeLayout";
import LoginPage from "@/features/Auth/components/loginPage";
import SignupPage from "@/features/Auth/components/signupPage";
import ForgetPassword from "@/features/Auth/components/forgetPassword";
import About from "@/features/home/components/About";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/features/Dashboard/Dashboard";
import Task from "@/features/task/components/Tasks";
import { preventAuthLoader } from "@/components/AuthLoader.jsx"; // We only need this one now
import ProjectPage from "@/components/ProjectPage";
import MemberProfile from "@/features/Task/components/MemberProfile";
import UserProfile from "@/components/UserProfile";
import Calendar from "@/features/Dashboard/components/CalendarSection";
import useCurrentUserQuery from "@/hooks/useCurrentUserQuery";

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
}

const AppRouter = () => {
  useCurrentUserQuery();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "login",
          loader: preventAuthLoader,
          element: <LoginPage />,
        },
        {
          path: "signup",
          loader: preventAuthLoader,
          element: <SignupPage />,
        },
        {
          path: "forgot-password",
          loader: preventAuthLoader,
          element: <ForgetPassword />,
        },
      ],
    },

    // App Layout
    {
      path: "/app",
      element: <AppLayout />, // Your main layout for public pages
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "projects",
          element: <ProjectPage />,
        },
        {
          path: "tasks",
          element: <Task />,
        },
        {
          path: "tasks/:name",
          element: <MemberProfile />,
        },
        {
          path: "userprofile",
          element: <UserProfile />,
        },
        {
          path: "calendar",
          element: <Calendar />,
        },
      ],
    },

    // Fallback route
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
