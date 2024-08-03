import React from 'react'
import DeleteModal from '../modals/Delete'
import ConfirmModal from '../modals/Confirm'

import './styles.css'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

// Definição do tipo Person com campos que você mencionou
type Person = {
  id: number
  nome: string
  clinica: string
  estrada: string
  saida: string
  permanencia: string
  status: string
}

// Dados de exemplo com um único registro manual
const data: Person[] = [
  {
    id: 1,
    nome: 'João Silva',
    clinica: 'Clínica A',
    estrada: 'Estrada B',
    saida: '2024-08-01',
    permanencia: '2 horas',
    status: 'Ativo'
  },
  {
    id: 2,
    nome: 'Maria Oliveira',
    clinica: 'Clínica B',
    estrada: 'Estrada C',
    saida: '2024-08-02',
    permanencia: '1 hora',
    status: 'Inativo'
  },
  {
    id: 3,
    nome: 'Carlos Souza',
    clinica: 'Clínica C',
    estrada: 'Estrada D',
    saida: '2024-08-03',
    permanencia: '3 horas',
    status: 'Ativo'
  },
  {
    id: 4,
    nome: 'Ana Costa',
    clinica: 'Clínica D',
    estrada: 'Estrada E',
    saida: '2024-08-04',
    permanencia: '2 horas',
    status: 'Ativo'
  },
  {
    id: 5,
    nome: 'Lucas Pereira',
    clinica: 'Clínica E',
    estrada: 'Estrada F',
    saida: '2024-08-05',
    permanencia: '4 horas',
    status: 'Inativo'
  },
  {
    id: 6,
    nome: 'Fernanda Lima',
    clinica: 'Clínica F',
    estrada: 'Estrada G',
    saida: '2024-08-06',
    permanencia: '1 hora',
    status: 'Ativo'
  }
]


const columns: ColumnDef<Person, any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'clinica',
    header: 'Clínica',
  },
  {
    accessorKey: 'estrada',
    header: 'Estrada',
  },
  {
    accessorKey: 'saida',
    header: 'Saída',
  },
  {
    accessorKey: 'permanencia',
    header: 'Permanência',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: () => (
      <>
      <ConfirmModal id={'2'} name={'felipe'}/>
      <DeleteModal id={'2'} name={'felipe'}/>
      </>
    )
  }
]

export function Table() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold mr-4">Pesquisar</h2>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 border border-gray-300 rounded shadow-md"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan} className="p-2 border-b border-gray-300">
                  {header.isPlaceholder ? null : (
                    <>
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
                    </>
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
      <div className="mt-4 flex items-center gap-2">
        <button
          className="border rounded p-2 bg-gray-200 hover:bg-gray-300"
          onClick={() => rerender()}
        >
          Force Rerender
        </button>
      </div>
    </div>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} className="border p-2 rounded w-full"/>
  )
}
