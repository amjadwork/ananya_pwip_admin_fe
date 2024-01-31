import React, { useState, useMemo } from 'react';
import { useTable, Column, useGlobalFilter, useFilters, usePagination, useSortBy, TableState } from 'react-table';
import { SortAscending, SortDescending, Pencil, Trash } from 'tabler-icons-react';
import { ActionIcon, ScrollArea } from "@mantine/core";
import GlobalFilter from '../ReactTable/GlobalFilter/GlobalFilter';

interface TableColumns {
  Header: string;
  accessor: string;
  width?: string;
  sortable?: boolean;
  fixed?: boolean;
  filterable?: boolean;
}

const tableStyle = {
  border: '1px solid #dddddd',
  fontFamily: 'arial, sans-serif',
  borderCollapse: 'collapse' as const,
  width: '100%',
  marginTop: '20px',
  overflowX: 'auto',
  tableLayout: 'fixed'
};

const cellStyle = {
  border: '1px solid #D9E4EC',
  textAlign: 'left' as const,
  padding: '7px',
};

const evenRowStyle = {
  backgroundColor: '#D9E4EC',
};

const searchFieldStyle ={
    marginRight: '2px',
    fontFamily: 'arial, sans-serif',
}

const ReactTable: React.FC<{ columns: readonly Column<any>[]; data: any[]; onEditRow: (row: any) => void; onDeleteRow: (row: any) => void }> = ({ columns, data, onEditRow, onDeleteRow }) => {

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
    state: { pageIndex: currentPage },
    state,
    setGlobalFilter,
  } = useTable<Record<string, any>>(
    { columns, data },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any;

//   const { globalFilter } = state;

  return (
    <>
    {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/> */}
    <div  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'  }}>
        {headerGroups.map((headerGroup: any) => (
          headerGroup.headers.map((column: any) => (
            <span {...getTableProps()} style={searchFieldStyle} > {column.canFilter && column.render('Filter', { placeholder: `Filter by ${column.Header}` })}</span>
          ))
        ))}
      </div>

      <ScrollArea>
        <table {...getTableProps()} style={tableStyle} className="table">
          <thead>
            {headerGroups.map((headerGroup: any, headerGroupIndex: number) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column: any, columnIndex: number) => (
                  <th {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : {})}
                    style={{
                      width: column.width,
                      position: (columnIndex === 0 || columnIndex === headerGroup.headers.length - 1) ? 'sticky' : 'relative',
                      left: (columnIndex === 0) ? 0 : 'auto',
                      right: (columnIndex === headerGroup.headers.length - 1) ? 0 : 'auto',
                      zIndex: (columnIndex === 0 || columnIndex === headerGroup.headers.length - 1) ? 1 : 'auto',
                       backgroundColor: (columnIndex === 0) ? '#f8f9fa' : ((columnIndex === headerGroup.headers.length - 1) ? '#f8f9fa' : 'transparent'),
                    }}  >
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
            {page.map((row: any, i: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={i % 2 === 0 ? evenRowStyle : {}}>
                  {row.cells.map((cell: any, cellIndex: number) => {

                    if (cell.column.id === 'action') {
                      return (
                          <th
                          {...cell.getCellProps()}
                          style={{
                            ...cellStyle,
                            backgroundColor:'#f8f9fa',
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent:'center',
                            position: (cellIndex === row.cells.length - 1) ? 'sticky' : 'relative',
                            right: (cellIndex === row.cells.length - 1) ? 0 : 'auto',
                            zIndex: (cellIndex === row.cells.length - 1) ? 1 : 'auto'
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
                    } else if (cell.column.id === 'serialNo') {
                      return <td {...cell.getCellProps()}  style={{
                        ...cellStyle,
                        backgroundColor:'#f8f9fa',
                        position: (cellIndex === 0) ? 'sticky' : 'relative',
                        left: (cellIndex === 0) ? 0 : 'auto',
                        zIndex: (cellIndex === 0) ? 1 : 'auto'
                      }}>
                        {(currentPage * page.length) + i + 1}
                        </td>;
                    } else {
                      return <td {...cell.getCellProps()} style={cellStyle}>{cell.render('Cell')}</td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>

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
            {currentPage + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </>
  );
};

export default ReactTable;
