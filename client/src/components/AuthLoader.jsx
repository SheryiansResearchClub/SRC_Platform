import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

function AuthLoader({ redirectPath, flag = false }) {
  const token = Cookies.get("accessToken");

  if (!flag && !token) {
    throw redirect(redirectPath);
  }

  if (flag && token) {
    throw redirect("/app");
  }

  return null;
}

export function requireAuthLoader() {
  return AuthLoader({ redirectPath: "/login", flag: false });
}

export function preventAuthLoader() {
  return AuthLoader({ redirectPath: "/app", flag: true });
}