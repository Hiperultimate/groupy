import { useEffect } from "react";
import SvgCrossIcon from "public/SvgCrossIcon";

const ClientNotification = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {

  useEffect(() => {
    const clearError = () => {
        setMessage("");
    };
    const closeError = setTimeout(clearError, 3000);
    return () => clearTimeout(closeError);
  }, [message, setMessage]);


  if (message) {
    return (
      <div className="fixed left-1/4 bottom-0 z-50 w-full">
        <div className="mx-auto mb-4 max-w-lg rounded-md border border-green-500 bg-green-100">
          <span className="float-right hover:cursor-pointer">
            <div onClick={() => setMessage("")} className="p-1">
              <SvgCrossIcon fillcolor="#22c55e" />
            </div>
          </span>
          <div className="my-2">
            <div className="mx-2 text-green-600">{message}</div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default ClientNotification;
