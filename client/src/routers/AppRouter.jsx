import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <-- 1. ADDED THIS IMPORT
import Home from '@/features/home/components/Home';
import HomeLayout from '@/layouts/HomeLayout';
import LoginPage from '@/features/Auth/components/loginPage';
import SignupPage from '@/features/Auth/components/signupPage';
import ForgetPassword from '@/features/Auth/components/forgetPassword';
import About from "@/features/home/components/About";
import AppLayout from '@/layouts/AppLayout';
import Dashboard from '@/features/Dashboard/Dashboard';
import Admin from '@/features/admin/components/Admin';
import ProjectPage from '@/features/admin/components/ProjectPage';
import MemberProfile from '@/features/admin/components/MemberProfile';
import UserProfile from '@/features/admin/components/UserProfile'
import { preventAuthLoader } from '@/components/AuthLoader.jsx'; // We only need this one now

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
          element: <ForgetPassword />,
        }
      ],
    },
    
    // --- 3. PRIVATE/PROTECTED ROUTES ---
    // Each of these is now wrapped in your <PrivateRoute>
    {
      path: "/dashboard",
      element: (
        // <PrivateRoute> // <-- Bypassed for now
          <AppLayout />
        // </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
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
      path: "/admin/projects",
      element: (
        // <PrivateRoute>
          <ProjectPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "/admin/member/:name",
      element: (
        // <PrivateRoute>
          <MemberProfile />
        // </PrivateRoute>
      ),
    },
    {
      path: "/userprofile",
      element: (
        // <PrivateRoute> // <-- Bypassed for now
          <UserProfile />
        // </PrivateRoute>
      ),
    },
    
    // Fallback route
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;

