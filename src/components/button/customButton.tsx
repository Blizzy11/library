"use client";
import { useState } from "react";

interface ButtonProps {
  text?: string;
  type: "button" | "submit" | "reset";
  color?: string;
  bgColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function CustomButton({
  text,
  type,
  onClick,
  disabled,
  color,
  bgColor,
  children,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: bgColor,
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: color,
    fontWeight: "600",
    boxShadow: "6px 6px #d946ef",
    ...(isHovered && {
      transform: "translateY(6px) translateX(6px)",
      boxShadow: "0px 0px",
    }),
  };

  return (
    <button
      disabled={disabled}
      type={type}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children || text}
    </button>
  );
}
