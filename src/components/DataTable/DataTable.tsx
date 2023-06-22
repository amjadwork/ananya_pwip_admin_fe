import React from 'react';
import {
Table,

} from "@mantine/core";


interface DataTableProps {
  dataCopy: any[];
  destinationSelectOptions: any[];
}

const DataTable = (props: DataTableProps) => {
    const { dataCopy, destinationSelectOptions } = props;
  
    const rows = dataCopy.map((item) => (
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
        
      <Table 
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
    );
  };

export default DataTable;
