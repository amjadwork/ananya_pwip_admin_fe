import React, { useEffect, useState, useMemo } from "react";
import { ScrollArea, Table, Box, Pagination, Group } from "@mantine/core";
import { Input } from "../../components";

interface DataTableProps {
  dataCopy: any[];
  // destinationSelectOptions: any[];
  columns: string[];
}

const DataTable = (props: DataTableProps) => {
  const { dataCopy, columns } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [length, setLength] = useState(2);
  const [recordsPerPage] = useState(10);
  const nPages = useMemo(() => Math.ceil(length / recordsPerPage), [length, recordsPerPage]);

  useEffect(() => {
    setFilteredData([...dataCopy]);
  }, [dataCopy]);

  useEffect(() => {
    console.log(filteredData);
    const getTotalLength = () => {
      let totalNumberOfChaData = 0;
   filteredData.map((item: any) => {
  if (item.list) {
    totalNumberOfChaData += item.list.length;
  }
});
      setLength(totalNumberOfChaData);
    };
    getTotalLength();
  }, [filteredData,setLength]);

  const setPage = (page: number) => {
    setCurrentPage(page-1);
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
          return (
            <tr key={item.name} style={{ textAlign: "center" }}>
              <td>{item.name}</td>
              <td>{listItem.destinationPort}</td>
              <td>{listItem.chaCharges}</td>
              <td>{listItem.silicaGelCharges}</td>
              <td>{listItem.craftPaperCharges}</td>
              <td>{listItem.transportCharges}</td>
              <td>{listItem.customCharges}</td>
              <td>{listItem.loadingCharges}</td>
            </tr>
          );
        })}
      </React.Fragment>
    ));
  }, [filteredData]);

  const tableHeader = useMemo(() => {
    return columns.map((column: string) => (
      <th key={column}>{column}</th>
    ));
  }, [columns]);

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
              {tableHeader}
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
