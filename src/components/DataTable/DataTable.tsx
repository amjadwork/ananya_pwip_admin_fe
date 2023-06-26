import React, { useEffect, useState, useMemo } from "react";
import { ScrollArea, Table, Box, Pagination, Group } from "@mantine/core";
import { Input } from "../../components";

interface DataTableProps {
  dataCopy: any[];
  destinationSelectOptions: any[];
}

const DataTable = (props: DataTableProps) => {
  const { dataCopy, destinationSelectOptions } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [length, setLength] = useState(2);
  const [recordsPerPage] = useState(10);
  const nPages = Math.ceil(length / recordsPerPage);

  useEffect(() => {
    setFilteredData([...dataCopy]);
  }, [dataCopy]);
  useEffect(() => {
    console.log(filteredData);
    const getTotalLength = () => {
      let totalNumberOfChaData = 0;
      filteredData.map((item: any) => {
        console.log(item.list.length);
        totalNumberOfChaData = totalNumberOfChaData + item.list.length;
      });
      setLength(totalNumberOfChaData);
    };
    getTotalLength();
  }, [filteredData]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = dataCopy.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const rows = useMemo(() => {
    return filteredData.map((item: any) => (
      <React.Fragment key={item.name}>
        {item.list.map((listItem: any) => {
          const destinationName = destinationSelectOptions.find(
            (f: any) => f.value === listItem._destinationPortId
          )?.label;

          return (
            <tr key={`${item.name}-${listItem._destinationPortId}`}>
              <td>{item.name}</td>
              <td>{destinationName}</td>
              <td>{listItem.chaCharge}</td>
              <td>{listItem.silicaGel}</td>
              <td>{listItem.craftPaper}</td>
              <td>{listItem.transportCharge}</td>
              <td>{listItem.customCharge}</td>
              <td>{listItem.loadingCharge}</td>
              <td>{listItem.coo}</td>
            </tr>
          );
        })}
      </React.Fragment>
    ));
  }, [filteredData, destinationSelectOptions]);

  return (
    <Box>
      <Input
        style={{ marginBottom: "8px" }}
        type="text"
        placeholder="Search by Origin Port"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Table
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        verticalSpacing="xl">
        <ScrollArea w={890} h={400}>
          <thead
            style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
            <tr>
              <th style={{ opacity: 1, color: "#fffff" }}>Origin</th>
              <th>Destination</th>
              <th>CHA</th>
              <th>SilicaGel</th>
              <th>CraftPaper</th>
              <th>Transport</th>
              <th>Custom</th>
              <th>Loading</th>
              <th>COO</th>
            </tr>
          </thead>

          <tbody
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}>
            {rows}
          </tbody>
        </ScrollArea>
      </Table>
      <Group style={{ margin: "5px" }}>
        <Pagination total={nPages} value={currentPage} />
      </Group>
    </Box>
  );
};

export default DataTable;
