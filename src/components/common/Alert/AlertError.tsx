import React from "react";
import { Alert } from "@mantine/core";



const AlertError =(props:any)=>{
    return(
          <Alert title="Something wrong" color="red" radius="md">
              API'S SHOWING ERROR.
            </Alert>
           );
}
export default AlertError;