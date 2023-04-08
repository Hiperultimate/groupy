import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="">
      <div>
        <a href="#">
          Logo
          {/* <Image src="logo.png" alt="Logo" width={25} height={25}/> */}
        </a>
      </div>
      <ul className="">
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
