import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SvgGroupyLogo from "public/SvgGroupyLogo";

type PageType = "signin" | "home" | "chat" | "settings" | "signup";

export const pageStates = {
  SIGNIN: "signin",
  SIGNUP: "signup",
  HOME: "home",
  CHAT: "chat",
  SETTINGS: "settings",
} as const;

const NavBar = () => {
  const router = useRouter();
  const currentUrl = router.asPath;
  const { data: sessionData } = useSession();

  let selectedPage: PageType = pageStates.SIGNIN;
  let onlyLogo = false;

  // This code block is just to handle states for css changes
  switch (currentUrl) {
    case "/":
      selectedPage = pageStates.SIGNIN;
      onlyLogo = true;
      break;
    case "/sign-up":
      selectedPage = pageStates.SIGNUP;
      break;
    case "/home":
      selectedPage = pageStates.HOME;
      break;
    case "/settings":
      selectedPage = pageStates.SETTINGS;
      break;
    case "/chat":
      selectedPage = pageStates.CHAT;
      break;
    default:
      // Handle any other URLs
      break;
  }

  return (
    <nav
      className={`absolute z-50 flex h-20 w-screen items-center justify-between ${
        onlyLogo ? "bg-transparent" : "bg-white"
      }`}
    >
      <div>
        <a className="relative ml-5 flex font-teko text-[29px]" href="#">
          <div className="relative top-[3px] flex">
            <div className="mx-5">
              <SvgGroupyLogo />
            </div>
            <span className="relative">GROUPY</span>
          </div>
        </a>
      </div>
      {sessionData?.user && !onlyLogo && (
        <ul className="mr-5 flex gap-8 font-poppins font-normal text-grey">
          <li>
            <a
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out ${
                selectedPage === pageStates.HOME ? `underline` : ``
              }`}
              href="#"
            >
              Home
            </a>
          </li>

          <li>
            <a
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out ${
                selectedPage === pageStates.CHAT ? `underline` : ``
              }`}
              href="#"
            >
              Chat
            </a>
          </li>

          <li>
            <a
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out ${
                selectedPage === pageStates.SETTINGS ? `underline` : ``
              }`}
              href="#"
            >
              Settings
            </a>
          </li>

          <li>
            <a
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out`}
              href="#"
              onClick={() => void signOut()}
            >
              Logout
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
