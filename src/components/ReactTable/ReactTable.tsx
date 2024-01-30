import React, { useState, useMemo } from 'react';
import { useTable, Column, useFilters, usePagination, useSortBy, TableState } from 'react-table';
import { SortAscending, SortDescending, Pencil, Trash } from 'tabler-icons-react';
import {
    ActionIcon,
  } from "@mantine/core";

interface TableColumns {
  Header: string;
  accessor: string;
  width?: string;
  sortable?: boolean;
  fixed?: boolean;
  filterable?: boolean;
}

interface CustomTableState<T extends object> extends TableState<T> {
  filters?: Record<string, any>[];
}

const tableStyle = {
  border: '1px solid #dddddd',
  fontFamily: 'arial, sans-serif',
  borderCollapse: 'collapse' as const,
  width: '100%',
  marginTop: '10px',
  overflowX: 'auto',
};

const cellStyle = {
  border: '1px solid #D9E4EC',
  textAlign: 'left' as const,
  padding: '3px',
};

const evenRowStyle = {
  backgroundColor: '#D9E4EC',
};

const ReactTable: React.FC<{ columns: readonly Column<any>[]; data: any[]; onEditRow: (row: any) => void; onDeleteRow: (row: any) => void }> = ({ columns, data, onEditRow, onDeleteRow }) => {
  const [filters, setFilters] = useState<Record<string, any>[]>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
  } = useTable<Record<string, any>>(
    { columns, data },
    useFilters,
    useSortBy,
    usePagination
  ) as any;

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((oldFilters) => {
      const existingFilterIndex = oldFilters.findIndex((filter) => filter.id === columnId);
      const newFilters = [...oldFilters];

      if (existingFilterIndex !== -1) {
        newFilters[existingFilterIndex].value = value;
      } else {
        newFilters.push({ id: columnId, value });
      }

      return newFilters;
    });
  };

  const filteredRows = useMemo(() => {
    return page.filter((row: any) => {
      return filters.every((filter) => {
        const accessorValue = row.values[filter.id];
        if (accessorValue === undefined || accessorValue === null) return true;
        if (typeof accessorValue === 'string') {
          return accessorValue.toLowerCase().includes(filter.value.toLowerCase());
        }
        return accessorValue === filter.value;
      });
    });
  }, [page, filters]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {headerGroups.map((headerGroup: any) => (
          headerGroup.headers.map((column: any) => (
            column.filterable ? (
              <div key={column.id}>
                <input
                  id={column.id}
                  value={(filters.find((filter: any) => filter.id === column.id) || {}).value || ''}
                  onChange={(e) => handleFilterChange(column.id, e.target.value)}
                  placeholder={`Filter by ${column.Header}`}
                />
              </div>
            ) : null
          ))
        ))}
      </div>

      <table {...getTableProps()} style={tableStyle} className="table">
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : {})}
                style={{ width: column.width }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{column.render('Header')}</span>
                    {column.sortable && (
                      <span
                        style={{
                          marginLeft: '4px',
                          marginTop: '4px',
                          color: 'gray',
                          cursor: 'pointer',
                        }}
                      >
                        {column.isSorted ? (
                          column.isSortedDesc ? <SortDescending size={20} /> : <SortAscending size={20} />
                        ) : <SortAscending size={20}/>}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {filteredRows.map((row: any, i: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={i % 2 === 0 ? evenRowStyle : {}}>
                {row.cells.map((cell: any) => {
                  if (cell.column.id === 'action') {
                    return (
                        <th
                        {...cell.getCellProps()}
                        style={{
                          ...cellStyle,
                          display: 'flex',
                          alignItems: 'center', 
                          justifyContent:'center'
                        }}
                      >
                        <ActionIcon
                          variant="default"
                          onClick={() => onEditRow(row.original)}
                          style={{ cursor: 'pointer', marginRight: '8px' }}
                        >
                          <Pencil size="1rem" color="green" />
                        </ActionIcon>
                      
                        <ActionIcon
                          variant="default"
                          onClick={() => onDeleteRow(row.original)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Trash size="1rem" color="red" />
                        </ActionIcon>
                      </th>
                    );
                  } else {
                    return <td {...cell.getCellProps()} style={cellStyle}>{cell.render('Cell')}</td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '15px' }}>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous Page
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next Page
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </>
  );
};

export default ReactTable;
