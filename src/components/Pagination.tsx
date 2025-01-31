import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import useContentStore from '../store/useContentsStore';
import { useEffect } from 'react';



export default function Pagination({}) {

  const { getPageContents, setPage, page , total, limit, skip } = useContentStore();

  const goToPage = (page: number) => {
    if (page < 1 || page > total) return;
    setPage(page);
    getPageContents(page);
  };

  useEffect(() => {     
    //getPageContents(page);
  }, [page, limit, skip]);

  const currentPage = page;
  const totalPages = Math.ceil(total / limit);

  console.log("total", total, "limit", limit, "currentPage",currentPage);


  return (
    <nav className="flex items-center mt-4 justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
        >
          <ArrowLongLeftIcon aria-hidden="true" className="mr-3 w-5 text-gray-400" />
          Previous
        </button>
      </div>

      <div className="hidden md:-mt-px md:flex">

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 ${
                isActive
                  ? "inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
                  : "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
        >
          Next
          <ArrowLongRightIcon aria-hidden="true" className="ml-3 w-5 text-gray-400" />
        </button>
      </div>
    </nav>
  );
}
