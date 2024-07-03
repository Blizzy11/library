"use client";
import React, { useState } from "react";

type Option = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  data: Option[];
  onChange?: (value: string) => void;
}

const CustomSelect = ({ data, onChange }: CustomSelectProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(data[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "black",
    fontWeight: "600",
    boxShadow: "6px 6px #d946ef",
    ...(isHovered && {
      transform: "translateY(6px) translateX(6px)",
      boxShadow: "0px 0px",
    }),
  };

  return (
    <div>
      <div
        className="dropdown"
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <summary
          role="button"
          tabIndex={0}
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={toggleDropdown}
          className="btn"
        >
          {selectedOption.label}
        </summary>
        {isOpen && (
          <ul
            tabIndex={0}
            className="mt-5 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 border border-black"
            style={{ position: "absolute", top: "100%", left: 0 }}
          >
            {data.map((item, index) => (
              <li
                key={index}
                onClick={() => selectOption(item)}
                className={
                  "hover:bg-fuchsia-500 hover:text-white font-semibold"
                }
              >
                <a href="#" style={{ display: "flex", alignItems: "center" }}>
                  {selectedOption === item && (
                    <svg
                      className="h5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
