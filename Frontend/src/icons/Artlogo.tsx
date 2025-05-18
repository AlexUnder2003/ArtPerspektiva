// src/icons/Artlogo.tsx
import * as React from "react";
import type { IconSvgProps } from "../types"; // ваш интерфейс IconSvgProps

export const ARTLOGO: React.FC<IconSvgProps> = ({
  size = 32,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 19"
    width={size || width}
    height={size || height}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M0 18.508 6.745.348h3.865l6.771 18.16h-4.099l-1.4-3.71h-6.72l-1.374 3.71z"
    />
  </svg>
);

export default ARTLOGO;
