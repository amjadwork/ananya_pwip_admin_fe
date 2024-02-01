import React, { useState, useMemo } from 'react';
import { useTable, Column, useGlobalFilter, useFilters, usePagination, useSortBy, TableState } from 'react-table';
import { SortAscending, SortDescending,ArrowsDownUp, Pencil, Trash } from 'tabler-icons-react';
import { ActionIcon, ScrollArea } from "@mantine/core";
// import GlobalFilter from './GlobalFilter/GlobalFilter';
import ColumnFilter from './ColumnFilter/ColumnFilter';

const tableStyle = {
  border: '1px solid #D9E4EC',
  fontFamily: 'arial, sans-serif',
  borderCollapse: 'collapse' as const,
  width: '100%',
  marginTop: '10px',
  overflowX: 'auto',
  tableLayout: 'fixed'
};

const cellStyle = {
  border: '1px solid #D9E4EC',
  textAlign: 'left' as const,
  padding: '7px',
};

const CheckboxContainerStyle = {
    marginTop:"2px",
    border: '1px #D9E4EC',
    padding: '4px',
    fontSize:"14px",
    fontWeight: "500"
  };
  

const evenRowStyle = {
  backgroundColor: '#D9E4EC',
};

const searchFieldStyle ={
    marginLeft: '8px',
    fontFamily: 'arial, sans-serif',
}

const ReactTable: React.FC<{ columns: readonly Column<any>[]; data: any[]; onEditRow: (row: any) => void; onDeleteRow: (row: any) => void }> = ({ columns, data, onEditRow, onDeleteRow }) => {

    const defaultColumn = useMemo(() => {
        return {
            Filter: ColumnFilter
        } as Partial<Column<Record<string, any>>>;
    }, []);


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
    allColumns,
    state: { pageIndex: currentPage, pageSize },
    // state,
    // setGlobalFilter,
  } = useTable<Record<string, any>>(
    { columns, data, defaultColumn},
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any;

//   const { globalFilter } = state;

  return (
    <>
    {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/> */}
    <div style={CheckboxContainerStyle}>
     Hide/Show Columns
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent:"space-between" }}>
  {allColumns.map((column: any) => (
    column.showCheckbox && (
      <div key={column.id} >
        <label style={{fontSize:"14px"}}>
          <input type="checkbox" {...column.getToggleHiddenProps()} />
          {column.Header}
        </label>
      </div>
    )
  ))}
</div>
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
                    position: ((columnIndex === 0 || column.id === 'action') ? 'sticky' : 'relative'),
                    left: (columnIndex === 0 ? 0 : 'auto'),
                    right: ((columnIndex === headerGroup.headers.length - 1 || column.id === 'action') ? 0 : 'auto'),
                    zIndex: ((columnIndex === 0 || column.id === 'action') ? 1 : 'auto'),
                    backgroundColor: (columnIndex === 0) ? '#f8f9fa' : ((columnIndex === headerGroup.headers.length - 1 || column.id === 'action') ? '#f8f9fa' : 'transparent'),
                  }} >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                    {column.sortable && (
                        <span
                          style={{
                            marginRight: '4px',
                            marginTop: '4px',
                            color: 'gray',
                            cursor: 'pointer',
                          }}
                        >
                          {column.isSorted ? ( 
                            column.isSortedDesc ? <SortDescending size={20} /> : <SortAscending size={20} />
                          ) : <ArrowsDownUp size={20}/>}
                        </span>
                      )}
                      <span>{column.render('Header')}</span>
                     
                      {column.filterable && (
                        <span {...column.getHeaderProps()} style={searchFieldStyle}>
                          {column.render('Filter', { placeholder: `Filter by ${column.Header}` })}
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
                            {row.original.active === 0 ? (
                                  <ActionIcon variant="outline" color="gray">
                                    <Pencil size="1rem" color="gray"/>
                                  </ActionIcon>
                                ) : (
                                  <ActionIcon
                                    variant="default"
                                    onClick={() => onEditRow(row.original)}
                                  >
                                    <Pencil size="1rem" color="blue" />
                                  </ActionIcon>
                                )}
                                {row.original.active === 0 ? (
                                  <ActionIcon variant="outline" color="gray" >
                                    <Trash size="1rem" color="gray" />
                                  </ActionIcon>
                                ) : (
                                  <ActionIcon
                                    variant="default"
                                    onClick={() => onDeleteRow(row.original)}
                                  >
                                    <Trash size="1rem"  color="red" />
                                  </ActionIcon>
                                )}
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
                        {(currentPage * pageSize) + i + 1}
                        </td>;
                    }
                     else {
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
