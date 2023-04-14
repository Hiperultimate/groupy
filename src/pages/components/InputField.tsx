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
    changeInputState: React.Dispatch<React.SetStateAction<string>> | ((value : string) => void);
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
    <div className="flex flex-col">
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
          className="h-10 border-2 rounded-lg px-4 py-6"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          name={title}
          id={title}
          required={isRequired}
          disabled={disabled}
          className="h-10 border-2 rounded-lg px-4 py-6"
        />
      )}
    </div>
  );
};

export default InputField;
