import React, { useState, useEffect, useCallback } from 'react';
import DeleteModal from '../modals/Delete';
import ConfirmModal from '../modals/Confirm';
import './styles.css';
import { formatDate } from '~/util';
import { Record } from '@prisma/client';
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

interface TableProps {
  data: Record[];
}

const columns: ColumnDef<Record, any>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'company',
    header: 'Empresa',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
  },
  {
    accessorKey: 'clinic',
    header: 'Clínica',
  },
  {
    accessorKey: 'entryAt',
    header: 'Entrada',
    cell: ({ row }) => (
      <div className='flex min-h-fit gap-4'>
        {formatDate(row.original.entryAt).toString()}
      </div>
    ),
  },
  {
    accessorKey: 'confirmAt',
    header: 'Saída',
  },
  {
    accessorKey: 'permanence',
    header: 'Permanência',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex min-h-fit gap-4'>
        <ConfirmModal id={row.original.id.toString()} name={row.original.name.toString()} />
        <DeleteModal id={row.original.id.toString()} name={row.original.name.toString()} />
      </div>
    ),
  },
];

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
    <input {...props} value={value} onChange={e => setValue(e.target.value)} className="search_bar" />
  );
};

export const Table = ({ data }: TableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

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

  return (
    <>
      <div className='center'>
        <div className="w-[95%] lg:w-[80%]">
          <div className="search_area mb-5">
            <h2 className="text-xl font-semibold mr-4">Pesquisar</h2>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              className="search_bar"
            />
          </div>
          <div className="w-full overflow-x-auto">
            <table className="tabela">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} colSpan={header.colSpan} className="p-2 border-b border-gray-300">
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
                      <td key={cell.id} className="p-2">
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
        </div>
      </div>
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={handleNextPage} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
      </div>
    </>
  );
};
