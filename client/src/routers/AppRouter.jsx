// src/routers/AppRouter.jsx

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '@/features/home/components/Home';

// Import Layouts
import HomeLayout from '@/layouts/HomeLayout';

// Import Page Components
import LoginPage from '@/features/Auth/components/loginPage';
import SignupPage from '@/features/Auth/components/signupPage';
import ForgetPassword from '@/features/Auth/components/forgetPassword';
import Dashboard from '@/features/Dashboard/components/dashboard';
import About from "@/features/home/components/About";

/**
 * A component that protects routes from unauthenticated access.
 * It checks for an auth token in the Redux store.
 */
function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  
  // If a token exists, render the child component (e.g., the app layout).
  // Otherwise, navigate the user to the login page.
  return token ? children : <Navigate to="/login" />;
}

const AppRouter = () => {
  const router = createBrowserRouter([
    // --- Public Authentication Routes ---
    // These routes are for users who are not logged in.
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />,
    },

    // --- Private Application Routes (Protected) ---
    // The entire HomeLayout and its children are protected by PrivateRoute.
    {
      path: "/",
      element: (
        <PrivateRoute>
          <HomeLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true, // Makes Dashboard the default page for "/"
          element: <Home />,
        },
        {
          path: "about", // Renders at "/about"
          element: <About />,
        },
        // Add more protected routes here as needed
      ],
    },
    
    // --- Catch-all Route ---
    // Redirects any URL that doesn't match the above routes.
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;