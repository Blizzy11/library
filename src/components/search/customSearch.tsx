import React from "react";

interface CustomSearchProps {
  placeholder: string;
  onChange?: (value: string) => void;
  setState?: React.Dispatch<React.SetStateAction<string>>;
}

const CustomSearch = (props: CustomSearchProps) => {
  return (
    <div className="relative mt-1">
      <input
        type="text"
        id="password"
        className="w-full pl-3 pr-10 py-2 border-2 border-black rounded-md focus:outline-none focus:border-fuchsia-500 transition-colors"
        placeholder={props.placeholder}
        autoComplete="off"
        onChange={(e) => {
          props.onChange && props.onChange(e.target.value);
          props.setState && props.setState(e.target.value);
        }}
      />
      <button className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors">
        <svg
          className="h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
    </div>
  );
};

export default CustomSearch;
