import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoIosDocument } from "react-icons/io";
import DeleteModal from '../modals/Delete';
import ConfirmModal from '../modals/Confirm';
import './styles.css';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RecordResponse } from '~/interfaces/IRecord';
import { Status } from '~/enumerators/Status';

interface TableProps {
  data: RecordResponse[];
  fetchRecords: () => void;
  relatory?: boolean;
  query?: URLSearchParams;
}

export const Table = ({ data, fetchRecords, relatory = false, query }: TableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns: ColumnDef<RecordResponse, any>[] = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'company', header: 'Empresa' },
    { accessorKey: 'type', header: 'Exame' },
    { accessorKey: 'clinic', header: 'Clínica' },
    {
      accessorKey: 'entryAtString',
      header: 'Entrada',
      cell: ({ row }) => (
        <div className='flex min-h-fit gap-4'>
          {row.original.entryAtString}
        </div>
      ),
    },
    {
      accessorKey: 'confirmedAtString',
      header: 'Saída',
      cell: ({ row }) => (
        <div className='flex min-h-fit gap-4'>
          {row.original.confirmedAtString}
        </div>
      ),
    },
    { accessorKey: 'permanence', header: 'Permanência' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={`flex min-h-fit gap-4 ${row.original.intStatus === Status.CONCLUIDO ? 'text-green-500' : 'text-yellow-500'}`}
        >
          {row.original.status}
        </div>
      ),
    },
    ...(!relatory ? [
      {
        id: 'actions',
        cell: ({ row }: { row: { original: RecordResponse } }) => {
          const { confirmedAt, id, name } = row.original;

          return (
            <div className='flex min-h-fit gap-4 text-center justify-center'>
              {confirmedAt ? (
                <DeleteModal
                  id={id.toString()}
                  name={name.toString()}
                  fetchRecords={fetchRecords}
                />
              ) : (
                <>
                  <ConfirmModal
                    id={id.toString()}
                    name={name.toString()}
                    fetchRecords={fetchRecords}
                  />
                  <DeleteModal
                    id={id.toString()}
                    name={name.toString()}
                    fetchRecords={fetchRecords}
                  />
                </>
              )}
            </div>
          );
        },
      }
    ] : []),
  ];

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePreviousPage = useCallback(() => {
    table.setPageIndex(table.getState().pagination.pageIndex - 1);
  }, [table]);

  const handleNextPage = useCallback(() => {
    table.setPageIndex(table.getState().pagination.pageIndex + 1);
  }, [table]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    table.setPageSize(Number(e.target.value));
  };

  return (
    <>
      <div className='px-2'>
        <div className="w-full mx-auto">
          <div className="search_area mb-5 flex items-center mt-5">
            {relatory ? (
              <IoIosDocument
                size={30}
                title='Gerar Relatório'
                className="ml-2 text-blue-600 cursor-pointer"
                onClick={() => {
                  window.open(`/relatorio?${query}`, '_blank');
                }}
              />
            ) : (
              <>
                <h2 className="text-xl font-semibold mr-4">Pesquisar</h2>
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  className="search_bar"
                />
              </>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="p-2 border-b border-gray-300 border-r"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-300">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="p-2 border-r"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.getPageCount() > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label htmlFor="pageSize" className="text-sm font-medium">Mostrar:</label>
                <select
                  id="pageSize"
                  value={pagination.pageSize}
                  onChange={handlePageSizeChange}
                  className="form-select border border-gray-300 rounded p-2 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="pagination-controls flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!table.getCanPreviousPage()}
                  className="btn-pagination"
                >
                  <FaChevronLeft size={24} />
                </button>
                <span className="text-sm font-medium">
                  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!table.getCanNextPage()}
                  className="btn-pagination"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} className="search_bar border-gray-300 rounded" />
  );
};
