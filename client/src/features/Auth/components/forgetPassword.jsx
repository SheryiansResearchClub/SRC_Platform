import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import masterBg from "@/assets/images/master.png";
import logoB from "@/assets/images/logob.png";
import logoW from "@/assets/images/logow.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { forgotPassword, error, message, isForgotPending, clearFeedback } = useAuth();

  useEffect(() => {
    return () => {
      clearFeedback();
    };
  }, [clearFeedback]);

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  return (
    <>
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
          disabled={isForgotPending}
          className="w-full rounded-lg bg-lime-400 py-3 font-bold text-black transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-300"
        >
          {isForgotPending ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </form>

      <p className="mt-6 text-center text-sm lg:hidden">
        <Link to="/login" className="font-semibold text-lime-500 hover:underline">
          Back to Sign In
        </Link>
      </p>

    </>
  );
}