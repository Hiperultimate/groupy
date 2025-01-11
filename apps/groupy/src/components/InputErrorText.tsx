const InputErrorText = ({ errorArray }: { errorArray?: string[] }) => {
  if (errorArray?.length) {
    return (
      <div className="mt-2 rounded-md border border-red-500 bg-red-100">
        <div className="ml-2 text-red-500">
          {errorArray.map((item, index) => {
            return (
              <div data-test="input-error" key={index}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <></>;
};

export default InputErrorText;
