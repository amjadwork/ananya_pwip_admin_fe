import React,{useState} from 'react';
import {ScrollArea, Table, Box} from "@mantine/core";
 import {Input} from "../../components"


interface DataTableProps {
  dataCopy: any[];
  destinationSelectOptions: any[];
}

const DataTable = (props: DataTableProps) => {
    const { dataCopy, destinationSelectOptions } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(dataCopy);



const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = dataCopy.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  console.log("d", destinationSelectOptions)

  const rows = filteredData.map((item:any) =>(
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
  
    return (
        <Box>
        <Input
          style={{marginBottom:"8px"}}
          type="text"
          placeholder="Search by Origin Port"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      <Table 
      sx={(theme: any) => ({
        display: "block",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : "#fff",
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.dark[9],
        textAlign: "left",
        cursor: "default",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
      })}
      highlightOnHover 
      withBorder 
      withColumnBorders>

        {/* <thead style={{ position: "sticky", top: 0}}> */}
        <ScrollArea w={890} h={400} >
        <thead style={{ position: "sticky", top:0, backgroundColor:"#666666"}}>
          <tr>
            <th style={{ opacity:1, color: "#fffff"}}>Origin</th>
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
        
        <tbody  style={{
       width: "100%",
       borderCollapse: "collapse",
       tableLayout: "fixed",
       }} >{rows}</tbody>
        </ScrollArea>
      </Table>
      </Box>
    );
  };

export default DataTable;
