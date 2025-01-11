import { type InputHTMLAttributes } from "react";
import InputErrorText from "./InputErrorText";

type InputFieldPropType = {
  title?: string;
  type?: string;
  isRequired: boolean;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  handleState?: {
    inputState: string;
    changeInputState:
      | React.Dispatch<React.SetStateAction<string>>
      | ((value: string) => void);
  };
  handleErrorState?: {
    inputState: string[];
    changeInputState: React.Dispatch<React.SetStateAction<string[]>>;
  };
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  title,
  type = "text",
  isRequired = false,
  placeholder,
  disabled,
  handleState,
  handleErrorState,
  ...rest
}: InputFieldPropType): JSX.Element => {
  return (
    <div className="flex flex-col">
      {title && (
        <label htmlFor={title} className="hover:cursor-pointer">
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
          onChange={(e) => {
            handleState.changeInputState(e.target.value);
            handleErrorState?.changeInputState([]);
          }}
          required={isRequired}
          disabled={disabled}
          {...rest}
          className="h-10 rounded-lg border-2 px-4 py-6"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          name={title}
          id={title}
          required={isRequired}
          disabled={disabled}
          {...rest}
          className="h-10 rounded-lg border-2 px-4 py-6"
        />
      )}
      <InputErrorText errorArray={handleErrorState?.inputState} />
    </div>
  );
};

export default InputField;
