import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OAuthButtons from "@/features/auth/components/OAuthButtons";
import { useAuth } from "@/features/auth/hooks/useAuth";
import logoW from "@/assets/images/logow.png";

export default function LoginPage() {
  const { login, error, clearFeedback, isAuthenticating } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    return () => {
      clearFeedback();
    };
  }, [clearFeedback]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login(credentials);
  };

  return (
    <>
      <div className="mb-6 flex justify-center lg:hidden">
        <div className="h-16 w-16 rounded-2xl bg-contain bg-center" style={{ backgroundImage: `url(${logoW})` }} />
      </div>

      <div className="mb-5 text-center">
        <h2 className="text-[30px] font-['Inter'] font-bold text-zinc-900">
          Welcome back to SRC!
        </h2>
        <p className="font-['Inter'] text-[13px] text-zinc-500">
          Please enter your details to sign in your account.
        </p>
      </div>

      <div className="space-y-2"><OAuthButtons /></div>

      <div className="my-5 flex items-center">
        <div className="flex-grow border-t border-zinc-200" />
        <span className="mx-4 flex-shrink text-xs text-zinc-400">Or sign in with</span>
        <div className="flex-grow border-t border-zinc-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1 block text-[12px] font-medium text-zinc-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@gmail.com"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-[12px] font-medium text-zinc-700">Password</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="minimum 8 characters"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="text-right text-xs">
          <Link to="/forgot-password" className="font-semibold text-lime-500 hover:underline">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={isAuthenticating} className="w-full rounded-lg bg-lime-400 py-3 font-bold text-black transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-300">
          {isAuthenticating ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="text-[12px] text-red-600">{error}</p>}
      </form>

      <p className="mt-6 text-center text-sm lg:hidden">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-lime-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
}