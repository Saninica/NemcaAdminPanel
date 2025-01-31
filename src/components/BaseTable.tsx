import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import Pagination from "./Pagination";


interface BaseTableProps<T extends Record<string, any>> {
  pageName: string;
  data: T[];
  createHref?: string;
  getEditHref?: (item: T) => string;
  deleteSubmit?: (id: number) => Promise<void>;
}

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

export default function BaseTable<T extends Record<string, any>>({
  pageName,
  data,
  createHref,
  getEditHref,
  deleteSubmit,
}: BaseTableProps<T>) {

  function generateColumns(data: T[]): Column<T>[] {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]) as Array<keyof T>;

    return keys.map((key) => ({
      header: String(key.toString().toUpperCase()),
      accessor: key,
    }));
  }

  const columns: Column<T>[] = generateColumns(data);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-900 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold text-white">
                  <button className="px-8" onClick={() => { history.back() }}>                 <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                  </button>
                  {pageName}</h1>
                <p className="mt-2 text-sm text-gray-300">
                  A list of all the {pageName} in your account including their details.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <a href={createHref}
                  type="button"
                  className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {pageName} Oluştur
                </a>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={String(column.accessor)}
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            {column.header}
                          </th>
                        ))}

                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {data.map((item, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td
                              key={String(column.accessor)}
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                            >
                              {column.render ? column.render(item) : String(item[column.accessor])}
                            </td>
                          ))}
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <a href={getEditHref && getEditHref(item)} className="text-indigo-400 hover:text-indigo-300">
                              Edit<span className="sr-only">, {pageName}</span>
                            </a>

                            <button onClick={() => deleteSubmit && deleteSubmit(item.id)} className="text-red-400 ml-4 hover:text-red-300">
                              Delete<span className="sr-only">, {pageName}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


          </div>
          <Pagination />

        </div>
      </div>
    </div>
  );
}