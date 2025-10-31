import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import AppRouter from "@/routers/AppRouter";
import QueryProvider from "@/providers/QueryProvider";
import StoreProvider from "@/providers/StoreProvider";

createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <QueryProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </QueryProvider>
  </StoreProvider>
);
