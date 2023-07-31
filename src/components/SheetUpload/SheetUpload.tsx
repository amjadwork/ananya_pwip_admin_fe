import React, { useState } from 'react';
import { Button, Group} from "@mantine/core";
import * as xlsx from "xlsx";
import APIRequest from "../../helper/api";

function SheetUpload() {
    const [jsonData, setJsonData] = useState<any>([]);
    
    const handleSheetToJson = (e:any) => {
        e.preventDefault();
        if (e) {
          const reader = new FileReader();
            reader.onload = (e:any) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                const payload = {data: json} 
                setJsonData(payload)
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }
    const handleJsonUpload = async () => {
        const response = await APIRequest("variant/bysheet", "POST", jsonData);
        if (response) {
          return ("success");
        }
      };
      
    
  return (
<form>
<input
       type="file"
       id="upload"
       name="upload" 
       accept= " application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
       onChange={handleSheetToJson}
       style={{ width: '14rem' }}
        />  

    <Group position="right" mt="md" spacing="sm"> 
         <Button 
         variant="light"
         color='dark'
         type="reset" 
         onClick={handleJsonUpload}
         >Reset</Button>

         <Button 
         variant="filled"
         type="button" 
         onClick={handleJsonUpload}
         >Upload Excel Sheet</Button>
         </Group>
</form>     
 
  );
}

export default SheetUpload;