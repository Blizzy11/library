"use client";

import React from "react";

interface CustomToastProps {
  text: string;
  icon?: string;
  alertType?: string;
}

const CustomToast = ({
  text,
  icon = "fa fa-envelope",
  alertType = "alert-info",
}: CustomToastProps) => {
  // toast display none after 5 seconds
  setTimeout(() => {
    document.querySelector(".toast")?.classList.add("hidden");
  }, 5000);

  return (
    <div className="toast toast-top toast-end z-50 mt-[20%]">
      <div className={`alert ${alertType}`}>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default CustomToast;
