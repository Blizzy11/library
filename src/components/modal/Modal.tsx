"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "./Modal.module.css";

interface ModalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  buttonCloseActive?: boolean;
}

const Modal = ({
  children,
  modalTitle,
  isOpen,
  onClose,
  buttonCloseActive = true,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={isOpen ? style.overlay : ``}>
      <dialog
        id="my-modal"
        className={`modal ${isOpen ? "open" : ""} modal-bottom sm:modal-middle`}
        ref={dialogRef}
        open={isOpen}
        onClick={handleBackdropClick}
      >
        <div className="modal-box bg-white">
          <form method="dialog">
            {/* Button to close modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-black text-lg border-b border-black pb-2">
            {modalTitle}
          </h3>
          <div className="py-4">{children}</div>
          {buttonCloseActive && (
            <div className="modal-action">
              <button className="btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
