import React, { useMemo, useState } from "react";
import {
  useTable,
  Column,
  useGlobalFilter,
  useFilters,
  usePagination,
  useSortBy,
} from "react-table";
import {
  SortAscending,
  SortDescending,
  ArrowsDownUp,
  Pencil,
  Trash,
  ChartDots,
} from "tabler-icons-react";
import { ActionIcon, ScrollArea, Button, Flex, Checkbox } from "@mantine/core";
import ColumnFilter from "./ColumnFilter/ColumnFilter";
import CustomTooltip from "../CustomTooltip/CustomTooltip";

const tableStyle = {
  border: "1px solid #D9E4EC",
  fontFamily: "arial, sans-serif",
  borderCollapse: "collapse" as const,
  width: "100%",
  marginTop: "10px",
  overflowX: "auto",
  tableLayout: "fixed",
};

const cellStyle = {
  border: "1px solid #D9E4EC",
  textAlign: "left" as const,
  padding: "4px",
};

const CheckboxContainerStyle = {
  marginTop: "2px",
  border: "1px #D9E4EC",
  padding: "4px",
  fontSize: "14px",
  fontWeight: "500",
};

const evenRowStyle = {
  backgroundColor: "#D9E4EC",
};

const searchFieldStyle = {
  fontFamily: "arial, sans-serif",
};

const ReactTable: React.FC<{
  columns: readonly Column<any>[];
  data: any[];
  onEditRow?: (row: any, index: any) => void;
  onDeleteRow?: (row: any) => void;
  handleRiceProfile?: (row: any) => void;
  actionButtons: {
    label: string;
    onClickAction: (row: any) => void;
    type: string;
    color: string;
  }[];
}> = ({
  columns,
  data,
  onEditRow,
  onDeleteRow,
  handleRiceProfile,
  actionButtons,
}) => {
  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter,
    } as Partial<Column<Record<string, any>>>;
  }, []);

  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [expandedServicesRows, setExpandedServicesRows] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedUsersRows, setExpandedUsersRows] = useState<{
    [key: number]: boolean;
  }>({});

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
  } = useTable<Record<string, any>>(
    { columns, data, defaultColumn },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any;

  const handleToggleButton = (rowIndex: number, column: any) => {
    const setExpandedRowsState = (stateToUpdate: any) => {
      stateToUpdate((prevExpandedRows: any) => {
        const newExpandedRows = { ...prevExpandedRows };
        if (newExpandedRows[rowIndex]) {
          delete newExpandedRows[rowIndex];
        } else {
          // Close previously opened toggle button
          Object.keys(newExpandedRows).forEach((key: any) => {
            delete newExpandedRows[key];
          });
          newExpandedRows[rowIndex] = true;
        }
        return newExpandedRows;
      });
    };
    if (column === "servicesNames") {
      setExpandedRowsState(setExpandedServicesRows);
    } else if (column === "applicableUsers") {
      setExpandedRowsState(setExpandedUsersRows);
    } else {
      setExpandedRowsState(setExpandedRows);
    }
  };

  return (
    <>
      <Flex align="right" justify="end" gap="md">
        {actionButtons.map((item: any, index: number) => {
          return (
            <Button
              key={item.text + index * 27}
              type={item.type}
              onClick={item.onClickAction}
              variant="default"
            >
              {item.label}
            </Button>
          );
        })}
      </Flex>

      {allColumns.some((column: any) => column.showCheckbox) && (
        <div style={CheckboxContainerStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              border: "2px solid #D9E4EC",
              paddingInline: "4px",
              marginTop: "4px",
            }}
          >
            {allColumns.map(
              (column: any) =>
                column.showCheckbox && (
                  <div key={column.id}>
                    <input type="checkbox" {...column.getToggleHiddenProps()} />
                    <label
                      style={{
                        fontSize: "14px",
                        marginLeft: "2px",
                      }}
                    >
                      {column.Header}
                    </label>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      <ScrollArea scrollbarSize={4} offsetScrollbars>
        <table {...getTableProps()} style={tableStyle} className="table">
          <thead>
            <tr>
              {headerGroups.map(
                (headerGroup: any, headerGroupIndex: number) => (
                  <React.Fragment key={headerGroupIndex}>
                    {headerGroup.headers.map(
                      (column: any, columnIndex: number) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps(
                            column.sortable ? column.getSortByToggleProps() : {}
                          )}
                          style={{
                            width: column.width,
                            position:
                              columnIndex === 0 || column.id === "action"
                                ? "sticky"
                                : "relative",
                            left: columnIndex === 0 ? 0 : "auto",
                            right:
                              columnIndex === headerGroup.headers.length - 1 ||
                              column.id === "action"
                                ? 0
                                : "auto",
                            zIndex:
                              columnIndex === 0 || column.id === "action"
                                ? 1
                                : "auto",
                            backgroundColor:
                              columnIndex === 0
                                ? "#f8f9fa"
                                : columnIndex ===
                                      headerGroup.headers.length - 1 ||
                                    column.id === "action"
                                  ? "#f8f9fa"
                                  : "transparent",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              {column.sortable && (
                                <span
                                  style={{
                                    marginTop: "2px",
                                    marginRight: "4px",
                                    color: "gray",
                                    cursor: "pointer",
                                  }}
                                >
                                  {column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <SortDescending size={15} />
                                    ) : (
                                      <SortAscending size={15} />
                                    )
                                  ) : (
                                    <ArrowsDownUp size={15} />
                                  )}
                                </span>
                              )}
                              <span>{column.render("Header")}</span>
                            </div>
                          </div>
                        </th>
                      )
                    )}
                  </React.Fragment>
                )
              )}
            </tr>
            <tr>
              {headerGroups.map(
                (headerGroup: any, headerGroupIndex: number) => (
                  <React.Fragment key={headerGroupIndex}>
                    {headerGroup.headers.map(
                      (column: any, columnIndex: number) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps(
                            column.sortable ? column.getSortByToggleProps() : {}
                          )}
                          style={{
                            width: column.width,
                            position:
                              columnIndex === 0 || column.id === "action"
                                ? "sticky"
                                : "relative",
                            left: columnIndex === 0 ? 0 : "auto",
                            right:
                              columnIndex === headerGroup.headers.length - 1 ||
                              column.id === "action"
                                ? 0
                                : "auto",
                            zIndex:
                              columnIndex === 0 || column.id === "action"
                                ? 1
                                : "auto",
                            backgroundColor:
                              columnIndex === 0
                                ? "#f8f9fa"
                                : columnIndex ===
                                      headerGroup.headers.length - 1 ||
                                    column.id === "action"
                                  ? "#f8f9fa"
                                  : "transparent",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              {column.filterable && (
                                <div
                                  {...column.getHeaderProps()}
                                  style={{
                                    ...searchFieldStyle,
                                    marginLeft: "4px",
                                    marginTop: "0",
                                    marginBottom: "4px",
                                    width: `${column.width}px`, // Set the width to 100%
                                  }}
                                >
                                  {column.render("Filter", {
                                    placeholder: `Filter by ${column.Header}`,
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </th>
                      )
                    )}
                  </React.Fragment>
                )
              )}
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: any, i: any) => {
              prepareRow(row);
              return (
                <React.Fragment key={i}>
                  <tr {...row.getRowProps()} style={i % 2 === 0 ? {} : {}}>
                    {row.cells.map((cell: any, cellIndex: number) => (
                      <React.Fragment key={cellIndex}>
                        {(() => {
                          if (cell.column.id === "servicesNames") {
                            return (
                              <td
                                style={{
                                  marginTop: "12px",
                                  paddingLeft: "0.5rem",
                                  paddingRight: "0.5rem",
                                }}
                              >
                                <Button
                                  onClick={() =>
                                    handleToggleButton(i, "servicesNames")
                                  }
                                  size="sm"
                                  disabled={
                                    row.original.servicesNames.length === 0
                                  }
                                  variant="default"
                                  fullWidth
                                  style={{
                                    height: "2rem",
                                  }}
                                >
                                  {row.original.servicesNames.length === 0
                                    ? "No Services"
                                    : expandedServicesRows[i]
                                      ? "Hide Services"
                                      : "Show Services"}
                                </Button>
                                <div
                                  style={{
                                    display: expandedServicesRows[i]
                                      ? "block"
                                      : "none",
                                  }}
                                >
                                  {row.original.servicesNames.map(
                                    (list: any, p_Index: any) => (
                                      <div key={p_Index}>
                                        {p_Index + 1}. {list}
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                            );
                          } // Inside the cell.render function for the request body column
                          else if (cell.column.id === "requestBody") {
                            return (
                              <td
                                style={{
                                  marginTop: "12px",
                                  paddingLeft: "1rem",
                                  paddingRight: "1rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  position: "relative",
                                }}
                              >
                                <Button
                                  onClick={() =>
                                    handleToggleButton(i, "requestBody")
                                  }
                                  size="sm"
                                  variant="default"
                                  fullWidth
                                  style={{
                                    height: "2rem",
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                  }}
                                >
                                  {Array.isArray(row.original.requestBody) &&
                                  row.original.requestBody.length === 0
                                    ? "No Request Body"
                                    : expandedRows[i]
                                      ? "Hide Request Body"
                                      : "Show Request Body"}
                                </Button>
                                <div
                                  style={{
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                    display: expandedRows[i] ? "block" : "none",
                                  }}
                                >
                                  {row.original.requestBody &&
                                  typeof row.original.requestBody ===
                                    "object" ? (
                                    Object.entries(
                                      row.original.requestBody
                                    ).map(([key, value], index) => (
                                      <div key={index}>
                                        <span style={{ fontWeight: "bold" }}>
                                          {key}
                                        </span>
                                        : {String(value)}
                                      </div>
                                    ))
                                  ) : (
                                    <div>No Request Body</div>
                                  )}
                                </div>
                              </td>
                            );
                          } else if (cell.column.id === "permissionName") {
                            return (
                              <td
                                style={{
                                  marginTop: "12px",
                                  paddingLeft: "0.5rem",
                                  paddingRight: "0.5rem",
                                }}
                              >
                                <Button
                                  onClick={() =>
                                    handleToggleButton(i, "common")
                                  }
                                  size="sm"
                                  disabled={
                                    row.original.permissionName.length === 0
                                  }
                                  variant="default"
                                  fullWidth
                                  style={{
                                    height: "2rem",
                                  }}
                                >
                                  {row.original.permissionName.length === 0
                                    ? "No Permissions"
                                    : expandedRows[i]
                                      ? "Hide Permissions"
                                      : "Show Permissions"}
                                </Button>
                                <div
                                  style={{
                                    display: expandedRows[i] ? "block" : "none",
                                  }}
                                >
                                  {row.original.permissionName.map(
                                    (list: any, p_Index: any) => (
                                      <div key={p_Index}>
                                        {p_Index + 1}. {list}
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                            );
                          } else if (cell.column.id === "applicableUsers") {
                            return (
                              <td
                                style={{
                                  marginTop: "12px",
                                  paddingLeft: "0.5rem",
                                  paddingRight: "0.5rem",
                                }}
                              >
                                <Button
                                  onClick={() =>
                                    handleToggleButton(i, "applicableUsers")
                                  }
                                  size="sm"
                                  disabled={
                                    row.original.applicableUsers.length === 0
                                  }
                                  variant="default"
                                  fullWidth
                                  style={{
                                    height: "2rem",
                                  }}
                                >
                                  {row.original.applicableUsers.length === 0
                                    ? "No Users"
                                    : expandedUsersRows[i]
                                      ? "Hide Users"
                                      : "Show Users"}
                                </Button>
                                <div
                                  style={{
                                    display: expandedUsersRows[i]
                                      ? "block"
                                      : "none",
                                  }}
                                >
                                  {row.original.applicableUsers.map(
                                    (list: any, p_Index: any) => (
                                      <div key={p_Index}>
                                        {p_Index + 1}. {list}
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                            );
                          } else if (cell.column.id === "action") {
                            return (
                              <td
                                {...cell.getCellProps()}
                                style={{
                                  ...cellStyle,
                                  backgroundColor: "#f8f9fa",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  position:
                                    cellIndex === row.cells.length - 1
                                      ? "sticky"
                                      : "relative",
                                  right:
                                    cellIndex === row.cells.length - 1
                                      ? 0
                                      : "auto",
                                  zIndex:
                                    cellIndex === row.cells.length - 1
                                      ? 1
                                      : "auto",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "default",
                                }}
                                className="ellipsis"
                              >
                                {handleRiceProfile &&
                                  (row.original.active === 0 ? (
                                    <ActionIcon
                                      variant="outline"
                                      color="gray"
                                      style={{ marginRight: "6px" }}
                                    >
                                      <ChartDots size="1rem" color="gray" />
                                    </ActionIcon>
                                  ) : (
                                    <ActionIcon
                                      variant="default"
                                      onClick={() =>
                                        handleRiceProfile(row.original)
                                      }
                                      style={{ marginRight: "6px" }}
                                    >
                                      <ChartDots size="1rem" color="green" />
                                    </ActionIcon>
                                  ))}
                                {onEditRow &&
                                  (row.original.active === 0 ? (
                                    <ActionIcon
                                      variant="outline"
                                      color="gray"
                                      style={{ marginRight: "6px" }}
                                    >
                                      <Pencil size="1rem" color="gray" />
                                    </ActionIcon>
                                  ) : (
                                    <ActionIcon
                                      variant="default"
                                      onClick={() =>
                                        onEditRow(row.original, cellIndex)
                                      }
                                      style={{ marginRight: "6px" }}
                                    >
                                      <Pencil size="1rem" color="blue" />
                                    </ActionIcon>
                                  ))}
                                {onDeleteRow ? (
                                  row.original.active === 0 ? (
                                    <ActionIcon variant="outline" color="gray">
                                      <Trash size="1rem" color="gray" />
                                    </ActionIcon>
                                  ) : (
                                    <ActionIcon
                                      variant="default"
                                      onClick={() => onDeleteRow(row.original)}
                                    >
                                      <Trash size="1rem" color="red" />
                                    </ActionIcon>
                                  )
                                ) : (
                                  <ActionIcon variant="outline" color="gray">
                                    <Trash size="1rem" color="gray" />
                                  </ActionIcon>
                                )}
                              </td>
                            );
                          } else if (cell.column.id === "serialNo") {
                            return (
                              <td
                                {...cell.getCellProps()}
                                style={{
                                  ...cellStyle,
                                  backgroundColor: "#f8f9fa",
                                  position:
                                    cellIndex === 0 ? "sticky" : "relative",
                                  left: cellIndex === 0 ? 0 : "auto",
                                  zIndex: cellIndex === 0 ? 1 : "auto",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "default",
                                }}
                              >
                                {currentPage * pageSize + i + 1}
                              </td>
                            );
                          } else {
                            return (
                              <td
                                {...cell.getCellProps()}
                                style={{
                                  ...cellStyle,
                                  width: "100%",
                                  overflow: "auto", // Enable scrolling within the cell
                                  maxHeight: "50px", // Limit the height of the cell
                                  cursor: "default",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {cell.column.id === "planID" &&
                                  row.original.plan ? (
                                    <CustomTooltip
                                      data={row.original.plan}
                                      type="plan"
                                    />
                                  ) : null}
                                  {cell.column.id === "userID" &&
                                  row.original.user ? (
                                    <CustomTooltip
                                      data={row.original.user}
                                      type="user"
                                    />
                                  ) : null}
                                  {cell.render("Cell")}
                                </div>
                              </td>
                            );
                          }
                        })()}
                      </React.Fragment>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>

      <div style={{ marginTop: "15px" }}>
        <Button
          variant="default"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous Page
        </Button>{" "}
        <Button
          variant="default"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next Page
        </Button>{" "}
        <span>
          Page{" "}
          <strong>
            {currentPage + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </>
  );
};

export default ReactTable;
