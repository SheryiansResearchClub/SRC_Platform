// src/features/Auth/components/forgetPassword.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

// --- 1. IMPORT YOUR IMAGES AND THE REAL HOOK ---
import { useAuth } from "@/hooks/useAuth";
import masterBg from "@/assets/images/master.png";
import logoB from "@/assets/images/logob.png";
import logoW from "@/assets/images/logow.png";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  
  // --- 2. USE THE ACTUAL useAuth HOOK ---
  // This will get the real loading state, errors, and functions from your Redux slice.
  const { loading, error, message, forgotPassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the forgot password action with the email
    forgotPassword({ email });
  };

  return (
    <div className="min-h-screen bg-white font-sans lg:flex lg:items-center lg:justify-center lg:bg-black lg:p-[15px]">
      
      {/* Left Panel - Branding (Desktop Only) */}
      <div
        className="relative z-10 hidden h-[96vh] w-[43%] flex-col items-center justify-center rounded-[33px] bg-zinc-900 p-0 text-white lg:flex"
        // --- 3. USE THE IMPORTED IMAGES ---
        style={{ backgroundImage: `url(${masterBg})` }}
      >
        <div className="relative z-20 mx-auto max-w-lg space-y-4 text-center">
          <div className="bg-contain bg-center h-25 w-25 rounded-2xl mx-auto mb-8" style={{ backgroundImage: `url(${logoB})` }} />
          <h1 className="text-[32px] font-[Inter] leading-tight whitespace-nowrap">
            One Platform to Build. Learn. Evolve.
          </h1>
          <p className="text-[13px] font-[Inter] text-zinc-400">
            Collaborate with the brightest minds at SRC and grow through
            real-world projects and challenges.
          </p>
        </div>
        <p className="absolute bottom-8 left-8 z-20 text-sm text-zinc-500">
          © 2025 SRC
        </p>
        <div className="absolute inset-0 z-10 rounded-[33px] bg-gradient-to-t from-black to-black/70" />
      </div>

      {/* Right Panel / Mobile View Container */}
      <div className="flex w-full flex-1 items-center justify-center self-stretch bg-white lg:relative lg:-ml-24 lg:rounded-[33px]">
        
        {/* --- Desktop-Only Absolute Elements --- */}
        <div className="absolute top-8 left-[15%] z-20 hidden h-8 w-8 rounded-full bg-contain bg-center lg:block" style={{ backgroundImage: `url(${logoW})` }} />
        <div className="absolute top-8 right-8 text-sm hidden lg:block">
          <Link to="/login" className="font-semibold text-zinc-900 hover:underline">
            Back to Sign In
          </Link>
        </div>
        <div className="absolute bottom-8 right-8 hidden gap-6 text-sm lg:flex">
          <a href="#" className="text-zinc-500 hover:underline">Privacy Policy</a>
          <a href="#" className="text-zinc-500 hover:underline">Support</a>
        </div>

        {/* Right Content */}
        <div className="w-full max-w-sm p-8 lg:px-4">

          {/* Mobile-Only Logo */}
          <div className="mb-6 flex justify-center lg:hidden">
            <div className="h-16 w-16 rounded-2xl bg-contain bg-center" style={{ backgroundImage: `url(${logoB})` }} />
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-[30px] font-['Inter'] font-bold text-zinc-900">
              Forgot Password?
            </h2>
            <p className="font-['Inter'] text-[13px] text-zinc-500">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-[12px] font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-lime-400 py-3 font-bold text-black transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-300"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
            {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          </form>

          {/* Mobile-Only Bottom Link */}
           <p className="mt-6 text-center text-sm lg:hidden">
             <Link to="/login" className="font-semibold text-lime-500 hover:underline">
               Back to Sign In
             </Link>
           </p>

        </div>
      </div>
    </div>
  );
}