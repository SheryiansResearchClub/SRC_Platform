import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from '@/features/home/components/Home';
import HomeLayout from '@/layouts/HomeLayout';
import LoginPage from '@/features/Auth/components/loginPage';
import SignupPage from '@/features/Auth/components/signupPage';
import ForgetPassword from '@/features/Auth/components/forgetPassword';
import About from "@/features/home/components/About";
import AppLayout from '@/layouts/AppLayout';
import Dashboard from '@/features/dashboard/components/dashboard';
import Admin from '@/features/admin/components/admin';
import ProjectPage from '@/features/admin/components/ProjectPage';
import MemberProfile from '@/features/admin/components/MemberProfile';
import { preventAuthLoader, requireAuthLoader } from '@/components/AuthLoader.jsx';

const AppRouter = () => {
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
        }
      ],
    },
    {
      path: "/app",
      element: <AppLayout />,
      loader: requireAuthLoader,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/admin/projects",
      element: <ProjectPage />,
    },
    {
      path: "/admin/members",
      element: <MemberProfile />,

    },
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;