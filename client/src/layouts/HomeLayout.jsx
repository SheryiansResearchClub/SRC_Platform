import { Outlet, useLocation } from 'react-router-dom';
import masterBg from '@/assets/images/master.png';
import logoB from '@/assets/images/logob.png';
import logoW from '@/assets/images/logow.png';

const HomeLayout = () => {

  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  if (location.state?.noLayout) {
    return <Outlet />;
  }

  return (
    <div className={`min-h-screen ${isAuthPage ? 'bg-white lg:flex lg:items-center lg:justify-center lg:bg-black lg:p-[15px]' : 'bg-white'}`}>
      {isAuthPage && (
        <div
          className="relative z-10 hidden h-[96vh] w-[43%] flex-col items-center justify-center rounded-[33px] bg-zinc-900 p-0 text-white lg:flex"
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
      )}

      <div className={`flex w-full ${isAuthPage ? 'flex-1 items-center justify-center self-stretch bg-white lg:relative lg:-ml-24 lg:rounded-[33px]' : ''}`}>
        {isAuthPage && (
          <>
            <div className="absolute top-8 left-[15%] z-20 hidden h-8 w-8 rounded-full bg-contain bg-center lg:block" style={{ backgroundImage: `url(${logoW})` }} />

            <div className="absolute top-8 right-8 text-sm hidden lg:block">
              {location.pathname === '/login' ? (
                <>
                  <span className="text-zinc-600">Don't have an account? </span>
                  <a href="/signup" className="font-semibold text-zinc-900 hover:underline">
                    Sign Up
                  </a>
                </>
              ) : (
                <>
                  <span className="text-zinc-600">Already have an account? </span>
                  <a href="/login" className="font-semibold text-zinc-900 hover:underline">
                    Sign In
                  </a>
                </>
              )}
            </div>

            <div className="absolute bottom-8 right-8 hidden gap-6 text-sm lg:flex">
              <a href="#" className="text-zinc-500 hover:underline">Privacy Policy</a>
              <a href="#" className="text-zinc-500 hover:underline">Support</a>
            </div>
          </>
        )}

        <div className={`w-full ${isAuthPage ? 'max-w-sm p-8 lg:px-4' : ''}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;