import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

interface BasePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function BasePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: BasePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <nav className="flex bg-gray-900 items-center mt-4 justify-between border-t border-gray-200 px-4 sm:px-0">
      {/* Previous Button */}
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 
                     text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 
                     disabled:opacity-50"
        >
          <ArrowLongLeftIcon aria-hidden="true" className="mr-3 w-5 text-white" />
          Previous
        </button>
      </div>

      {/* Numbered Buttons (for larger screens) */}
      <div className="hidden md:-mt-px md:flex">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 ${
                isActive
                  ? 'inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600'
                  : 'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 
                     text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 
                     disabled:opacity-50"
        >
          Next
          <ArrowLongRightIcon aria-hidden="true" className="ml-3 w-5 text-gray-400" />
        </button>
      </div>
    </nav>
  );
}
