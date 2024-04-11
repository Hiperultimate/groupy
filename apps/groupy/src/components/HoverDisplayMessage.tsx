import { useState } from "react";

function HoverDisplayMessage({ message }: { message: string }) {
  const [showMessage, setShowMessage] = useState(false);
  return (
    <span
      onMouseEnter={() => {
        setShowMessage(true);
      }}
      onMouseLeave={() => {
        setShowMessage(false);
      }}
      className="relative rounded-full bg-slate-200 px-[10px] hover:cursor-pointer"
    >
      <span className=" text-sm text-grey ">!</span>
        <span className={`${showMessage ? "visible opacity-1" : "invisible opacity-0"} absolute left-8 z-50 min-w-[15em] max-w-[20em] rounded-md bg-light-grey p-2 text-sm text-grey transition duration-300 ease-in-out`}>
          {message}
        </span>
    </span>
  );
}

export default HoverDisplayMessage;
