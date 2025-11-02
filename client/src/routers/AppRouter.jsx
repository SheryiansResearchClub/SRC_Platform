import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux"; // <-- 1. ADDED THIS IMPORT
import HomeLayout from "@/layouts/HomeLayout";
import Home from "@/features/home/components/Home";
import About from "@/features/home/components/About";
import LoginPage from "@/features/Auth/components/loginPage";
import SignupPage from "@/features/Auth/components/signupPage";
import ForgotPassword from "@/features/Auth/components/forgetPassword";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/features/Dashboard/Dashboard";
import ProjectPage from "@/components/ProjectPage";
// import TaskBox from "@/features/Task/components/TaskBox";
import MemberProfile from "@/features/Task/components/MemberProfile";
// import UserProfilePage from "@/components/UserProfile";
import Admin from "@/features/Task/components/Tasks";
import ProjectProfilePage from "@/features/ProjectPage/pages/ProjectProfilePage.jsx";
import { preventAuthLoader } from "@/components/AuthLoader";
import Tasks from "@/features/Task/components/Tasks";
import UserProfile from "@/components/UserProfile";
import useCurrentUserQuery from "@/hooks/useCurrentUserQuery";
// import Calendar from "@/features/Dashboard/components/CalendarSection";
// import Resources from "@/features/Dashboard/components/Resources";

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
          element: <ForgotPassword />,
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
          path: 'project/:id',
          element: <ProjectProfilePage />,
        },
        {
          path: "tasks/:name",
          element: <MemberProfile />,
        },
        {
          path: "userprofile",
          element: <UserProfile />,
        },
        // {
        //   path: "calendar",
        //   element: <Calendar />,
        // },
        // {
        //   path: "resources",
        //   element: <Resources />,
        // },
        {
          path: "tasks",
          element: <Tasks />,
        },
        {
          path: "tasks/:name",
          element: <MemberProfile />,
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
    //  {
    //   path: "/admin/projects",
    //   element: (
    //     // <PrivateRoute>
    //     <ProjectProfilePage />
    //     // </PrivateRoute>
    //   ),
    // },
    // {
    //   path: "/admin/member/:name",
    //   element: (
    //     // <PrivateRoute>
    //     <MemberProfile  />
    //     // </PrivateRoute>
    //   ),
    // },
    // {
    //   path: "/userprofile",
    //   element: (
    //     // <PrivateRoute> // <-- Bypassed for now
    //     <UserProfile />
    //     // </PrivateRoute>
    //   ),
    // },
    // Fallback route
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
