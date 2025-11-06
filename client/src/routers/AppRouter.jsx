import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import HomeLayout from "@/layouts/HomeLayout";
import Home from "@/features/home/components/Home";
import About from "@/features/home/components/About";
import LoginPage from "@/features/Auth/components/loginPage";
import SignupPage from "@/features/Auth/components/signupPage";
import ForgotPassword from "@/features/Auth/components/forgetPassword";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/features/Dashboard/Dashboard";
import ProjectPage from "@/features/AllProjects/ProjectPage";

import TeamProfilePage from "@/features/TeamPage/page/TeamProfilePage";
import MemberTasks from "@/features/Task/components/MemberTasks";
import Admin from "@/features/Task/components/Tasks";
import ProjectProfilePage from "@/features/ProjectPage/pages/ProjectProfilePage.jsx";
import { preventAuthLoader } from "@/components/AuthLoader";
import Tasks from "@/features/Task/components/Tasks";
import UserProfile from "@/components/UserProfile";
import AllTasks from "@/features/Task/components/AllTasks"
import TaskDetails from "@/features/Task/components/TaskDetails";
import AllTeamsPage from "@/features/AllTeams/pages/AllTeamsPage";


// Your PrivateRoute component is now here and will work
function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  // If a token exists, render the child component.
  // Otherwise, navigate the user to the login page.
  return token ? children : <Navigate to="/login" replace />;
}

const AppRouter = () => {
  const router = createBrowserRouter([
    // --- 2. PUBLIC ROUTES ---
    // These are separate and do not use PrivateRoute
    {
      path: "/",
      element: <HomeLayout />, // Your main layout for public pages
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
          loader: preventAuthLoader, // This is still good!
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
          element: <ForgotPassword />,
        },
      ],
    },

    // App Layout
    {
      path: "/app",
      element: <AppLayout />,
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
          path: 'project/:id',
          element: <ProjectProfilePage />,
        },
        {
          path: "tasks/:name",
          element: <MemberTasks />,
        },
        {
          path: "userprofile",
          element: <UserProfile />,
        },
        {
          path: "teams/:id",
          element: <TeamProfilePage />,
        },
        {
          path: "all-tasks/task-details",
          element: <TaskDetails />,
        },
        {
          path: "all-tasks",
          element: <AllTasks />,
        },

        {
          path: "teams",
          element: <AllTeamsPage />,
        },

        {
          path: "tasks",
          element: <Tasks />,
        },
        


      ],
    },
    {
      path: "/admin",
      element: (
        // <PrivateRoute>
        <Admin />
        // </PrivateRoute>
      ),
    },

    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
