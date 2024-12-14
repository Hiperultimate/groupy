import { useState, type KeyboardEventHandler } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { type StylesConfig } from "react-select";
import InputErrorText from "./InputErrorText";

import { api } from "~/utils/api";

export interface TagOption {
  value: string;
  label: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

export type DBTags = { "id": string; "name": string }[];

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

const InputCreatableSelect = ({
  id,
  handleFieldState,
  handleErrorState,
}: {
  id?: string,
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
  const { data: relatedTags } = api.tags.relatedTags.useQuery(inputValue);

  const filterTags = () => {
    if (!relatedTags) {
      return [];
    }
    const convertToRequiredType: TagOption[] = relatedTags.map(
      (object) => {
        return createOption(object.name);
      }
    );
    return convertToRequiredType;
  };

  // Populate data from the server
  const loadOptions = (
    inputValue: string,
    callback: (options: TagOption[]) => void
  ) => {
    setTimeout(() => {
      const gettingTagResult = filterTags();
      callback(gettingTagResult);
    }, 1000);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        const cleanInput = inputValue.replace(/ /g, "");
        const isExisting = handleFieldState.inputState.some(
          (obj) => obj.value === cleanInput
        );
        handleFieldState.setInputState((prev) => [
          ...prev,
          ...(isExisting ? [] : [createOption(cleanInput)]),
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
        onInputChange={(newValue) => {
          setInputValue(newValue); 
          handleErrorState.setErrorState([]);
        }}
        onKeyDown={handleKeyDown}
        loadOptions={loadOptions}
        placeholder="Type something and press enter..."
        value={handleFieldState.inputState}
        styles={creatableComponentStyle}
        inputId={id}

      />
      <InputErrorText errorArray={handleErrorState?.errorState} />
    </div>
  );
};

export default InputCreatableSelect;
