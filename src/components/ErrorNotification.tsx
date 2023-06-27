import { useEffect } from "react";
import SvgCrossIcon from "public/SvgCrossIcon";

const ErrorNotification = ({
  errorMessage,
  setErrorMessage,
}: {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {

  
  useEffect(() => {
    const clearError = () => {setErrorMessage("")};
    const closeError = setTimeout(clearError , 3000)
    return () => clearTimeout(closeError);
  }, [errorMessage,setErrorMessage])

  if(errorMessage){
    return (
      <div className="fixed bottom-0 z-50 w-full">
        <div className="mx-auto mb-4 max-w-lg rounded-md border border-red-500 bg-red-100">
          <span className="float-right hover:cursor-pointer">
            <div onClick={() => setErrorMessage("")} className="p-1">
              <SvgCrossIcon fillcolor="#ef4444" />
            </div>
          </span>
          <div className="my-2">
            <div className="mx-2 text-red-500">{errorMessage}</div>
          </div>
        </div>
      </div>
    );
  }

  return <></>
};

export default ErrorNotification;
