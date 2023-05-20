import { LpAnalyze } from "interfaces/interface";
import React, { SetStateAction } from "react";

interface Props {
  data: any;
  currentPage: number;
  setCurrentPage: React.Dispatch<SetStateAction<number>>;
  assetsPerPage: number;
}

export const Pagination = (Props: Props) => {
  const { data, currentPage, setCurrentPage, assetsPerPage } = Props;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex justify-center mt-8">
      <ul className="flex pl-0 rounded list-none flex-wrap">
        {data?.length > 0 &&
          Math.ceil(data?.length / assetsPerPage) > 1 &&
          Array(Math.ceil(data?.length / assetsPerPage))
            .fill("")
            .map((_, index) => (
              <li key={index}>
                <button
                  className={`text-gray-400 font-medium px-4 py-2 mr-1 mb-1 focus:outline-none ${
                    currentPage === index + 1
                      ? "text-gray-900 font-bold border-b-4 border-gray-300 transform scale-110"
                      : ""
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
      </ul>
    </div>
  );
};
