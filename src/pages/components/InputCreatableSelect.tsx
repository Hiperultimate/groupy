import { useState, type KeyboardEventHandler, useEffect } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { type StylesConfig } from "react-select";
import InputErrorText from "./InputErrorText";

export interface TagOption {
  value: string;
  label: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

// DUMMY DATA, you can initialize with id if needed.
// https://react-select.com/async
export const tagOptions: TagOption[] = [
  { value: "ocean", label: "Ocean" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];

const filterTags = (inputValue: string) => {
  return tagOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const creatableComponentStyle: StylesConfig<TagOption> = {
  control: (styles) => {
    return {
      ...styles,
      padding: "0.4em",
      borderWidth: "2px",
      borderColor: "#e5e7eb",
      boxShadow: "#e5e7eb",
      ":hover": {
        borderColor: "#e5e7eb",
      },
    };
  },
  option: (styles, { isFocused }: { isFocused: boolean }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#ff8640" : "#fff",
      color: isFocused ? "#fff" : "#000",
      ":hover": { backgroundColor: "#e15539", color: "#fff" },
    };
  },
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: "#f1723b",
      color: "#fff",
      borderRadius: 20,
      paddingLeft: "0.5em",
      paddingRight: "0.5em",
    };
  },
  multiValueLabel: (styles) => {
    return {
      ...styles,
      color: "#fff",
    };
  },
  multiValueRemove: (styles) => {
    return {
      ...styles,
      color: "#fff",
      cursor: "pointer",
      ":hover": {
        color: "#fff",
      },
    };
  },
};

// Instead of calling filterTags function maybe call async function to populate data
const loadOptions = (
  inputValue: string,
  callback: (options: TagOption[]) => void
) => {
  setTimeout(() => {
    callback(filterTags(inputValue));
  }, 1000);
};

const InputCreatableSelect = ({
  handleFieldState,
  handleErrorState,
}: {
  handleFieldState: {
    inputState: TagOption[];
    setInputState: React.Dispatch<React.SetStateAction<TagOption[]>>;
  };

  handleErrorState: {
    errorState: string[];
    setErrorState: React.Dispatch<React.SetStateAction<string[]>>;
  };
}) => {
  const [inputValue, setInputValue] = useState("");
  // const [selectedTags, setSelectedTags] = useState<readonly TagOption[]>([]);

  // Cleaup this block after development is finished.
  useEffect(() => {
    console.log("AsyncCreatableSelect : ", handleFieldState.inputState);
  }, [handleFieldState]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        handleFieldState.setInputState((prev) => [
          ...prev,
          createOption(inputValue),
        ]);
        setInputValue("");
        event.preventDefault();
    }
  };

  return (
    <div>
      <AsyncCreatableSelect
        inputValue={inputValue}
        isClearable
        cacheOptions
        isMulti
        onChange={(newValue) => {
          handleFieldState.setInputState(newValue as TagOption[]);
          handleErrorState.setErrorState([]);
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        loadOptions={loadOptions}
        placeholder="Type something and press enter..."
        value={handleFieldState.inputState}
        styles={creatableComponentStyle}
      />
      <InputErrorText errorArray={handleErrorState?.errorState} />
    </div>
  );
};

export default InputCreatableSelect;
