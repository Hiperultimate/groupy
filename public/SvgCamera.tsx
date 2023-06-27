type ComponentProp = {
  dimention?: number;
};

const SvgCamera = (props: ComponentProp) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.dimention ? props.dimention : 24}
    height={props.dimention ? props.dimention : 24}
    fill="none"
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11Z"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
    />
  </svg>
);
export default SvgCamera;
