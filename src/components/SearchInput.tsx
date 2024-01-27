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
    <input
      type="text"
      value={valueState}
      placeholder={placeholder}
      onChange={(e) => setValueState(e.target.value)}
      className="py-2 border"
    />
  );
};

export default SearchInput;
