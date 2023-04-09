import Image from "next/image";
import Logo from "public/GroupyLogo.svg";

const NavBar = () => {
  return (
    <nav className="ml-5 mr-5 flex h-20 items-center justify-between">
      <div>
        <a className="relative flex font-teko text-[29px]" href="#">
          <Image className="m-5" src={Logo as string} alt="logo" />
          <span className="relative top-[18px]">GROUPY</span>
        </a>
      </div>
      <ul className="flex gap-8 font-poppins font-normal text-grey">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Chat</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Logout</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
