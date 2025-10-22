import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OAuthButtons from "@/features/auth/components/OAuthButtons";
import { useAuth } from "@/features/auth/hooks/useAuth";
import logoB from "@/assets/images/logob.png";

export default function SignupPage() {
  const { signup, error, clearFeedback, isAuthenticating } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    return () => {
      clearFeedback();
    };
  }, [clearFeedback]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError(null);
    signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <>
      <div className="mb-6 flex justify-center lg:hidden">
        <div className="h-16 w-16 rounded-2xl bg-contain bg-center" style={{ backgroundImage: `url(${logoB})` }} />
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

      <form onSubmit={handleSignup} className="space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-[12px] font-medium text-zinc-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-[12px] font-medium text-zinc-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-[12px] font-medium text-zinc-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-[12px] font-medium text-zinc-700">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            placeholder="re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-zinc-300 p-2.5 text-[12px] placeholder-zinc-400 transition focus:border-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <button type="submit" disabled={isAuthenticating} className="w-full rounded-lg bg-lime-400 py-3 font-bold text-black transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-300">
          {isAuthenticating ? "Creating Account..." : "Create Account"}
        </button>
        {localError && <p className="text-[12px] text-red-600">{localError}</p>}
        {error && <p className="text-[12px] text-red-600">{error}</p>}
      </form>

      {/* Mobile-Only Bottom Link */}
      <p className="mt-6 text-center text-sm lg:hidden">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-lime-500 hover:underline">
          Sign In
        </Link>
      </p>

    </>
  );
}