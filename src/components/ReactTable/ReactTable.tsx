import React, { useState, useMemo } from 'react';
import { useTable, Column, useFilters, usePagination, TableState } from 'react-table';

// Define a type for your column
interface TableColumns {
  Header: string;
  accessor: string;
  width?: string;
  sortable?: boolean;
  fixed?: boolean;
  filterable?: boolean;
}

// Define a custom state interface that includes the filters property
interface CustomTableState<T extends object> extends TableState<T> {
  filters?: Record<string, any>[];
}

const tableStyle = {
  fontFamily: 'arial, sans-serif',
  borderCollapse: 'collapse' as const,
  width: '100%',
  marginTop: '20px',
  overflowX: 'auto',
};

const cellStyle = {
  border: '2px solid #dddddd',
  textAlign: 'left' as const,
  padding: '8px',
};

const evenRowStyle = {
  backgroundColor: '#dddddd',
};

const ReactTable: React.FC<{ columns: readonly Column<any>[]; data: any[] }> = ({ columns, data }) => {
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
    usePagination
  ) as any;

  const handleFilterChange = (columnId: string, value: string) => {
    // Update the filters in the state
    setFilters((oldFilters) => {
      const existingFilterIndex = oldFilters.findIndex((filter) => filter.id === columnId);
      const newFilters = [...oldFilters];

      if (existingFilterIndex !== -1) {
        // If filter exists, update its value
        newFilters[existingFilterIndex].value = value;
      } else {
        // If filter doesn't exist, add it
        newFilters.push({ id: columnId, value });
      }
 
      return newFilters;
    });
  };

  // Filter the rows based on the applied filters
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

  // Rendering logic remains the same except that we use filteredRows instead of rows
  return (
    <>
   {/* Filter inputs */}
<div style={{ display: 'flex', flexDirection: 'row'}}>
  {headerGroups.map((headerGroup: any) => (
    headerGroup.headers.map((column: any) => (
      // Render filter input only if the column has the 'filterable' flag set to true
      column.filterable ? (
        <div key={column.id}>
          {/* <label htmlFor={column.id} style={{ fontSize: '12px', fontStyle:'normal', fontWeight:'500' }}>{column.Header}</label> */}
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

      {/* Table */}
      <table {...getTableProps()} style={tableStyle} className="table">
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                  return <td {...cell.getCellProps()} style={cellStyle}>{cell.render('Cell')}</td>;
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
