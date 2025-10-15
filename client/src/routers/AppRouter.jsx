import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import HomeLayout from '@/layouts/HomeLayout'
import About from "@/features/home/components/About";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "about",
          element: <About />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default AppRouter