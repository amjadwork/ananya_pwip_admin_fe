import { useContext } from 'react';
import axios from "axios";
//Create a context for error handling:

const FetchData = async (url, method, data) => {

  
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
    console.log(error,"error");
    return error;
  }
}
export default FetchData;


