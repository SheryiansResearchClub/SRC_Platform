import { useAuth } from "../hooks/useAuth";

export default function OAuthButtons() {
  const { oauthLogin } = useAuth();

  return (
    // A fragment is used here since the parent div in LoginPage.jsx
    // already handles the spacing between these buttons.
    <>
      <button 
        onClick={() => oauthLogin("google")}
        className="flex w-full items-center justify-center rounded-md bg-black py-3 font-[Inter] text-[12px] text-white transition hover:bg-zinc-800"
      >
        Continue With Google
      </button>
      <button 
        onClick={() => oauthLogin("discord")}
        className="flex w-full items-center justify-center text-[12px] rounded-md bg-black py-3 font-[Inter] text-white transition hover:bg-zinc-800"
      >
        Continue With Discord
      </button>
    </>
  );
}
