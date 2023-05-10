const ErrorNotification = () =>
  //     {
  //   errorMessage,
  //   setErrorMessage,
  // }: {
  //   errorMessage: string;
  //   setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  // }
  {
    return (
      <div className="fixed bottom-0 z-50 w-full">
        <div className="mx-auto mb-4 max-w-lg rounded-md border border-red-500 bg-red-100">
          <div className="mx-2 text-red-500">Error Occured</div>
        </div>
      </div>
    );
  };

export default ErrorNotification;
