import React, { useEffect, useState, useCallback } from "react";

import {
  Group,
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Pagination,
  Text,
  Center,
  TextInput,
  Flex,
  Space,
  Button,
  ActionIcon,
  Select,
  Radio,
} from "@mantine/core";
import {
  Pencil,
  Trash,
  ChevronUp,
  ChevronDown,
  Selector,
  Search,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: "21px",
    height: "21px",
    borderRadius: "21px",
    marginLeft: "12px",
  },
}));

interface RowData {
  name: string;
  email: string;
  company: string;
}

interface TableSortProps {
  data: any;
  columns: any;
  actionItems?: any;
  onClickAction?: any;
  handleRowEdit?: any;
  handleRowDelete?: any;
  selectFilterTypes?: any; //enter array of object with column keys, type, name and labek
  selectedFilterValue?: any;
  handleSelectRadioFilterChange?: any;
}

interface ThProps {
  children: any;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  sortable: boolean;
}

function Th({ children, reversed, sorted, onSort, sortable }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Flex
          display="inline-flex"
          align={"center"}
          justify={
            children?.toLowerCase() !== "action" ? "space-between" : "flex-end"
          }
        >
          <Text weight="bold">{children}</Text>

          {sortable && (
            <Center className={classes.icon}>
              <Icon size="16px" strokeWidth={1.5} color={"#adb5bd"} />
            </Center>
          )}
        </Flex>
      </UnstyledButton>
    </th>
  );
}

function sortData(data: any, payload: { sortBy: any; reversed: any }) {
  const { sortBy } = payload;

  return [...data].sort((a, b) => {
    if (payload.reversed) {
      return b[sortBy].toString().localeCompare(a[sortBy].toString());
    }

    return a[sortBy].toString().localeCompare(b[sortBy].toString());
  });
}

export function DataTable({
  data,
  columns,
  actionItems,
  handleRowEdit,
  handleRowDelete,
  selectFilterTypes = [],
  selectedFilterValue = null,
  handleSelectRadioFilterChange = () => null,
}: TableSortProps) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<any>([]);
  const [sortBy, setSortBy] = useState<any>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [radioValue, setRadioValue] = useState<any>(null);

  useEffect(() => {
    if (selectedFilterValue) {
      setRadioValue(selectedFilterValue);
    }
  }, [selectedFilterValue]);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: any) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed }));
  };

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setSearch(value);

      const filtered = [...data].filter((item: any) => {
        return Object.keys(data[0]).some(
          (key: any) =>
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())
        );
      });

      if (value) {
        setSortedData([...filtered]);
      }

      if (!value) {
        setSortedData([...data]);
      }
    },
    [data]
  );

  return (
    <ScrollArea>
      <Flex align="center" justify="space-between">
        <Flex align="flex-start" justify="flex-start" gap="lg">
          <TextInput
            label="Search"
            placeholder="Search by any column"
            mb="md"
            icon={<Search size="14px" strokeWidth={1.5} color={"#adb5bd"} />}
            value={search}
            onChange={handleSearchChange}
          />
          {selectFilterTypes.map((item: any) => {
            if (item.type === "select") {
              return (
                <Select
                  label={item.label}
                  placeholder={item.placeholder || ""}
                  data={item.options}
                  name={item.name}
                />
              );
            }

            if (item.type === "radio-group") {
              return (
                <Radio.Group
                  name={item.name}
                  label={item.label}
                  value={radioValue}
                  onChange={(value) => {
                    handleSelectRadioFilterChange(value);
                  }}
                >
                  <Group>
                    {item.options.map((opt: any, index: any) => {
                      return (
                        <Radio
                          key={opt.label + index * 9}
                          value={opt.value}
                          label={opt.label}
                        />
                      );
                    })}
                  </Group>
                </Radio.Group>
              );
            }
          })}
        </Flex>
        <Flex align="center" gap="md">
          {actionItems.map((item: any, index: number) => {
            return (
              <Button
                key={item.label + index * 27}
                type={item.type}
                leftIcon={item.icon ? <item.icon size={14} /> : null}
                onClick={item.onClickAction}
                color={item.color || "gray"}
              >
                {item.label}
              </Button>
            );
          })}
        </Flex>
      </Flex>

      <Table
        horizontalSpacing="sm"
        verticalSpacing="md"
        fontSize="sm"
        mih={320}
        sx={{ tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            {columns.map((col: any, index: number) => {
              return (
                <Th
                  key={col.label + "_" + index * 17}
                  sorted={sortBy === col.key}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(col.key)}
                  sortable={col.sortable || false}
                >
                  {col.label}
                </Th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData
              .slice((activePage - 1) * pageSize, activePage * pageSize)
              .map((row: any, index: number) => {
                const columnKeys = [...columns].map((col: any) => col.key);

                return (
                  <tr key={row._id + index * 19}>
                    {columnKeys.map((key: any, colIndex: number) => {
                      if (key === "action") {
                        return (
                          <td key={row[key] + colIndex * 137}>
                            <Flex justify="flex-end" gap="sm" align="center">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => handleRowEdit(row, index)}
                              >
                                <Pencil size="1rem" />
                              </ActionIcon>

                              <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => handleRowDelete(row, index)}
                              >
                                <Trash size="1rem" />
                              </ActionIcon>
                            </Flex>
                          </td>
                        );
                      }
                      if (key === "originPortName") {
                        return (
                          <td key={key + index}>
                            {row["linkedOrigin"]
                              ?.map(
                                (originPort: any) => originPort?.originPortName
                              )
                              .join(" ,")}
                          </td>
                        );
                      }

                      return (
                        <td
                          style={{
                            overflow: "hidden",
                            whiteSpace: "pre",
                          }}
                          key={row[key] + colIndex * 223}
                        >
                          {row[key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Space h={18} />
      <Center>
        <Pagination
          total={Math.ceil(data.length / pageSize)}
          page={activePage}
          onChange={setPage}
        />
      </Center>
    </ScrollArea>
  );
}

export default DataTable;
