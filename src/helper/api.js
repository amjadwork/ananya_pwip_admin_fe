import React, { useState,useEffect,useContext } from "react";
import axios from "axios";
import { ErrorContext } from "./../context/errorContext";

//Create a context for error handling:

const FetchData = async (url, method, data) => {
  // const [error,setError]=useState(false);
  // console.log(error,"error");
  // // const { setError } = useContext(ErrorContext);

  try {
    let response;
    switch (method) {
      case "GET":
        response = await axios.get(url);
        break;
      case "GETBYID":
        response = await axios.get(url);
        break;
      case "POST":
        response = await axios.post(url, data);
        break;
      case "PUT":
        response = await axios.put(url, data);
        break;
      case "DELETE":
        response = await axios.delete(url, data);
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }
    return response.data;
  } catch (error) {
    console.log(error.message);
    // setError(true);
    // console.log(error,"error");
    return null;
  }
}
export default FetchData;


