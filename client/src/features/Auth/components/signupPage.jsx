// src/features/Auth/components/signupPage.jsx

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signupUser } from "../slice/authSlice";
import OAuthButtons from "./OAuthButtons";

// --- 1. IMPORT YOUR IMAGES HERE ---
import masterBg from "@/assets/images/master.png";
import logoB from "@/assets/images/logob.png";
import logoW from "@/assets/images/logow.png";

export default function SignupPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleSignup = (e, data) => {
    e.preventDefault();
    dispatch(signupUser(data));
  };

  return (
    <div className="min-h-screen bg-white font-sans lg:flex lg:items-center lg:justify-center lg:bg-black lg:p-[15px]">
      
      {/* Left Panel - Branding (Desktop Only) */}
      <div
        className="relative z-10 hidden h-[96vh] w-[43%] flex-col items-center justify-center rounded-[33px] bg-zinc-900 p-0 text-white lg:flex"
        // --- 2. USE THE IMPORTED IMAGES ---
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
          <span className="text-zinc-600">Already have an account? </span>
          <Link to="/login" className="font-semibold text-zinc-900 hover:underline">
            Sign In
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
            <div 
              className="h-16 w-16 rounded-2xl bg-contain bg-center" 
              // Using the black logo here for better visibility on a white background
              style={{ backgroundImage: `url(${logoB})` }} 
            />
          </div>

          <div className="mb-5 text-center">
            <h2 className="text-[30px] font-['Inter'] font-bold text-zinc-900">
              Create an Account
            </h2>
            <p className="font-['Inter'] text-[13px] text-zinc-500">
              Please enter your details to create your account.
            </p>
          </div>

          <div className="space-y-2"><OAuthButtons /></div>

          <div className="my-5 flex items-center">
            <div className="flex-grow border-t border-zinc-200" />
            <span className="mx-4 flex-shrink text-xs text-zinc-400">Or sign up with</span>
            <div className="flex-grow border-t border-zinc-200" />
          </div>

          <form onSubmit={(e) => handleSignup(e, {})} className="space-y-3">
            <div>
              <label htmlFor="name" className="mb-1 block text-[12px] font-medium text-zinc-700">Name</label>
              <input type="text" id="name" placeholder="John Doe" className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-[12px] font-medium text-zinc-700">Email</label>
              <input type="email" id="email" placeholder="johndoe@gmail.com" className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-[12px] font-medium text-zinc-700">Password</label>
              <input type="password" id="password" placeholder="minimum 8 characters" className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0" />
            </div>
             <div>
               <label htmlFor="confirm-password" className="mb-1 block text-[12px] font-medium text-zinc-700">Confirm Password</label>
               <input type="password" id="confirm-password" placeholder="re-enter your password" className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0" />
             </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-lime-400 py-3 font-bold text-black transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-300">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            {error && <p className="text-[12px] text-red-600">{error}</p>}
          </form>

           {/* Mobile-Only Bottom Link */}
           <p className="mt-6 text-center text-sm lg:hidden">
             Already have an account?{' '}
             <Link to="/login" className="font-semibold text-lime-500 hover:underline">
               Sign In
             </Link>
           </p>

        </div>
      </div>
    </div>
  );
}