const InputErrorText = ({ errorArray }: { errorArray?: string[] }) => {
  if (errorArray?.length) {
    return (
      <div className="mt-2 bg-red-100 border-red-500 border rounded-md">
        <div className="ml-2 text-red-500">
          {errorArray.map((item, index) => {
            return <div key={index}>{item}</div>;
          })}
        </div>
      </div>
    );
  }

  return <></>;
};

export default InputErrorText;
