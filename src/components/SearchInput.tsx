import SvgMagnifyingIcon from "public/SvgMagnifyingIcon";

const SearchInput = ({
  placeholder,
  valueState,
  setValueState,
}: {
  placeholder?: string;
  valueState: string;
  setValueState: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex rounded-md border px-2 py-2">
      <input
        type="text"
        value={valueState}
        placeholder={placeholder}
        className="w-full outline-none"
        onChange={(e) => setValueState(e.target.value)}
      />
      <SvgMagnifyingIcon />
    </div>
  );
};

export default SearchInput;
