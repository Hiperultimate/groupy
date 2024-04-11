type ComponentProp = {
  fillcolor?: string;
  dimension?: number;
};

const SvgUploadIcon = (props: ComponentProp) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.dimension ? props.dimension : 32}
    height={props.dimension ? props.dimension : 32}
    fill="none"
    viewBox="0 0 36 36"
    {...props}
  >
    <path
      fill={props.fillcolor ? props.fillcolor : "#f1723b"}
      d="m11.613 10.28 3.054-3.067V20a1.333 1.333 0 1 0 2.666 0V7.213l3.054 3.067a1.335 1.335 0 0 0 1.893 0 1.332 1.332 0 0 0 0-1.893l-5.333-5.334a1.333 1.333 0 0 0-.44-.28 1.333 1.333 0 0 0-1.014 0 1.333 1.333 0 0 0-.44.28L9.72 8.387a1.339 1.339 0 0 0 1.893 1.893ZM28 16a1.333 1.333 0 0 0-1.333 1.333v8a1.333 1.333 0 0 1-1.334 1.334H6.667a1.334 1.334 0 0 1-1.334-1.334v-8a1.333 1.333 0 1 0-2.666 0v8a4 4 0 0 0 4 4h18.666a4 4 0 0 0 4-4v-8A1.334 1.334 0 0 0 28 16Z"
    />
  </svg>
);
export default SvgUploadIcon;
