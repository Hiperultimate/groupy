import * as React from "react";

type ComponentProp = {
  fillcolor?: string;
  svgWidth?: number;
  svgHeight?: number;
};

const SvgGroupyLogo = (props: ComponentProp) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.svgWidth ? props.svgWidth : "36"}
    height={props.svgHeight ? props.svgHeight : "36"}
    fill="none"
    {...props}
  >
    <path
      fill={props.fillcolor ? props.fillcolor : "#E15539"}
      fillRule="evenodd"
      d="M1.992 6.248A2.015 2.015 0 0 1 4 8.254a2 2 0 0 0 4 0V2.007A2.015 2.015 0 0 1 10.006 0a2.012 2.012 0 0 1 1.993 2.007v13.117a2.002 2.002 0 0 0 2.778 1.897A2.001 2.001 0 0 0 16 15.124v-6.87a2.015 2.015 0 0 1 2.007-2.006 2.012 2.012 0 0 1 1.993 2.006v6.87a2 2 0 0 0 4 0V2.007A2.016 2.016 0 0 1 26.005 0a2.002 2.002 0 0 1 1.992 2.007v6.247a2.001 2.001 0 0 0 4 0 2.016 2.016 0 0 1 2.009-2.006 2.003 2.003 0 0 1 1.992 2.006V27.76a2 2 0 0 1-1.992 1.992 2.013 2.013 0 0 1-2.009-1.992 1.999 1.999 0 0 0-2.778-1.897 2.001 2.001 0 0 0-1.222 1.897V34a1.992 1.992 0 0 1-1.992 1.994A2.004 2.004 0 0 1 24 34.001V20.866a1.999 1.999 0 1 0-4 0v6.884a2.01 2.01 0 0 1-1.993 1.992 2.012 2.012 0 0 1-2.006-1.992v-6.884a2 2 0 0 0-4 0v13.135a2 2 0 0 1-4 0v-6.246a2 2 0 1 0-4 0 2.012 2.012 0 0 1-2.007 1.992A2.009 2.009 0 0 1 0 27.755v-19.5a2.012 2.012 0 0 1 1.994-2.007h-.002ZM8 14.008a2 2 0 1 0-4 0v8a2 2 0 0 0 4 0v-8Zm19.994 8v-8a2 2 0 1 1 4 0v8a2 2 0 0 1-4 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgGroupyLogo;
