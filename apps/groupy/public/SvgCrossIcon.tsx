type ComponentProp = {
  fillcolor?: string;
  size?: "S" | "L";
};

const SvgCrossIcon = (props: ComponentProp) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size === "L" ? 21 : 12} height={props.size === "L" ? 21 : 12} fill="none">
    <path
      stroke={props.fillcolor ? props.fillcolor : "#000000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props.size === "L" ? 1.2 : 2}
      d={
        props.size === "L" ? "m15.5 15.5-10-10m10 0-10 10" : "M9 3 3 9M3 3l6 6"
      }
    />
  </svg>
);
export default SvgCrossIcon;
