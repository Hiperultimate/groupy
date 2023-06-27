type ComponentProp = {
  fillcolor?: string;
};

const SvgCrossIcon = (props: ComponentProp) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none">
    <path
      stroke={props.fillcolor ? props.fillcolor : "#000000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 3 3 9M3 3l6 6"
    />
  </svg>
);
export default SvgCrossIcon;
