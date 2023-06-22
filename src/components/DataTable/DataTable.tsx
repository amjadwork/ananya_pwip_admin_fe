import React,{useState} from 'react';
import {
Table,

} from "@mantine/core";
 import {Input} from "../../components"
import { Book } from 'tabler-icons-react';

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
            </tr>
          );
        })}
      </React.Fragment>
    ));
  
    return (
        <div>
        <Input
          type="text"
          placeholder="Search by Origin Port"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      <Table 
      style={{marginTop:"20px"}}
      striped 
      highlightOnHover 
      withBorder 
      withColumnBorders>
        <thead>
          <tr>
            <th>Origin Port</th>
            <th>Destination Port</th>
            <th>Charge</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      </div>
    );
  };

export default DataTable;
