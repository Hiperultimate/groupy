const InputErrorText = ({ errorArray }: { errorArray?: string[] }) => {
  if (errorArray) {
    return (
      <div>
        {errorArray.map((item, index) => {
          return <div key={index}>{item}</div>;
        })}
      </div>
    );
  }

  return <></>
};

export default InputErrorText;
