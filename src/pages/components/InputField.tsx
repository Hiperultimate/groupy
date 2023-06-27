// TODO: Handle value states later

type InputFieldPropType = {
  title?: string;
  type?: string;
  isRequired: boolean;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  handleState?: {
    inputState: string;
    changeInputState: React.Dispatch<React.SetStateAction<string>>;
  };
};

const InputField = ({
  title,
  type = "text",
  isRequired = false,
  placeholder,
  disabled,
  handleState,
}: InputFieldPropType): JSX.Element => {
  return (
    <div>
      {title && (
        <label htmlFor={title}>
          {title}
          {isRequired ? "*" : ""}
        </label>
      )}
      {handleState ? (
        <input
          type={type}
          placeholder={placeholder}
          name={title}
          id={title}
          value={handleState.inputState}
          onChange={(e) => handleState.changeInputState(e.target.value)}
          required={isRequired}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          name={title}
          id={title}
          required={isRequired}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default InputField;
