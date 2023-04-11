import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "public/GroupyLogo.svg";

type PageType = "home" | "chat" | "settings";

export const pageStates = {
  HOME: "home",
  CHAT: "chat",
  SETTINGS: "settings",
} as const;

const NavBar = ({ onlyLogo = false }: { onlyLogo?: boolean }) => {
  const router = useRouter();
  const currentUrl = router.asPath;

  let selectedPage: PageType = pageStates.HOME;

  switch (currentUrl) {
    case "/":
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
      className={`absolute flex h-20 w-screen items-center justify-between z-50 ${
        onlyLogo ? "bg-transparent" : "bg-white"
      }`}
    >
      <div>
        <a className="relative ml-5 flex font-teko text-[29px]" href="#">
          <Image className="m-5" src={Logo as string} alt="logo" />
          <span className="relative top-[18px]">GROUPY</span>
        </a>
      </div>
      {!onlyLogo && (
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
