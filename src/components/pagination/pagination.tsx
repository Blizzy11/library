import React from "react";

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage?: number;
  onClick?: (page: number) => void;
}

const Paagination = ({
  page = 1,
  setPage,
  totalPage = 10,
}: PaginationProps) => {
  const renderPaginationButtons = (currentPage: number, totalPages: number) => {
    const maxButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
      const buttonPage = startPage + i;
      const isCurrentPage = buttonPage === currentPage;
      const buttonClass = `join-item btn btn-sm ${
        isCurrentPage
          ? "bg-black text-white hover:bg-black"
          : "hover:bg-black hover:text-white bg-transparent"
      }`;

      return (
        <button
          key={buttonPage}
          value={buttonPage}
          className={buttonClass}
          onClick={() => setPage && setPage(buttonPage)}
        >
          {buttonPage}
        </button>
      );
    });
  };

  return (
    <div className="join border border-black rounded-md">
      {/* Looping button for pages */}
      {renderPaginationButtons(page, totalPage)}
    </div>
  );
};

export default Paagination;
