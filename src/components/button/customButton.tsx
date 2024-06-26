"use client";
import { useState } from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  boxShadow?: string;
  text?: string;
  color?: string;
  bgColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  classname?: string;
}

export default function CustomButton({
  text,
  type,
  boxShadow,
  onClick,
  disabled,
  color,
  bgColor,
  children,
  classname,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: bgColor,
    border: "1px solid black",
    borderRadius: "5px",
    // padding: "10px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: color,
    fontSize: "px",
    fontWeight: "600",
    boxShadow: `${boxShadow || "6px 6px"} #d946ef`,
    ...(isHovered && {
      transform: "translateY(6px) translateX(6px)",
      boxShadow: "0px 0px",
    }),
  };

  return (
    <button
      disabled={disabled}
      className={classname}
      type={type}
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children || text}
    </button>
  );
}
