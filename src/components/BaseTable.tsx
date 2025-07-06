import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingComponent from './LoadingComponent';

interface BaseTableProps<T extends Record<string, unknown>> {
  pageName: string;
  data: T[];
  createHref?: string;
  getEditHref?: (item: T) => string;
  deleteSubmit?: (id: number) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  columns?: Column<T>[];
  actions?: boolean;
  onRefresh?: () => void;
}

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export default function BaseTable<T extends Record<string, unknown>>({
  pageName,
  data,
  createHref,
  getEditHref,
  deleteSubmit,
  isLoading = false,
  error = null,
  emptyMessage,
  columns: customColumns,
  actions = true,
  onRefresh,
}: BaseTableProps<T>) {
  const navigate = useNavigate();

  // Generate columns from data if not provided
  const defaultColumns = useMemo((): Column<T>[] => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]) as Array<keyof T>;
    return keys.map((key) => ({
      header: String(key).toUpperCase().replace(/_/g, ' '),
      accessor: key,
    }));
  }, [data]);

  const columns = customColumns || defaultColumns;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDelete = async (item: T) => {
    if (!deleteSubmit || !item.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete this ${pageName.toLowerCase()}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteSubmit(item.id as number);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <LoadingComponent />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-400">Error Loading {pageName}</h3>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            </div>
            {onRefresh && (
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div className="sm:flex-auto">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="mr-4 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{pageName}</h1>
                <p className="mt-1 text-sm text-gray-300">
                  Manage all {pageName.toLowerCase()} in your system
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
            {onRefresh && (
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Refresh
              </button>
            )}
            {createHref && (
              <Link
                to={createHref}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create {pageName.slice(0, -1)}
              </Link>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No {pageName.toLowerCase()} found</div>
              <p className="text-gray-500 text-sm">
                {emptyMessage || `Get started by creating your first ${pageName.toLowerCase().slice(0, -1)}.`}
              </p>
              {createHref && (
                <Link
                  to={createHref}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create {pageName.slice(0, -1)}
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={String(column.accessor)}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                          column.headerClassName || ''
                        }`}
                      >
                        {column.header}
                      </th>
                    ))}
                    {actions && (getEditHref || deleteSubmit) && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {data.map((item, index) => (
                    <tr
                      key={item.id ? String(item.id) : index}
                      className="hover:bg-gray-700 transition-colors duration-150"
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.accessor)}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${
                            column.className || ''
                          }`}
                        >
                          {column.render 
                            ? column.render(item) 
                            : String(item[column.accessor] || '-')
                          }
                        </td>
                      ))}
                      {actions && (getEditHref || deleteSubmit) && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {getEditHref && (
                            <Link
                              to={getEditHref(item)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-indigo-400 bg-indigo-900/20 hover:bg-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <PencilIcon className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          )}
                          {deleteSubmit && (
                            <button
                              onClick={() => handleDelete(item)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-red-400 bg-red-900/20 hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <TrashIcon className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}