import axios from "axios";

const APIRequest = async (
  endpoint: string,
  method: string,
  payload?: object
) => {
  const url = `http://43.205.147.191:8000/api/`;
  try {
    let response: any = null;
    switch (method) {
      case "GET":
        response = await axios.get(url + endpoint);
        break;
      case "POST":
        response = await axios.post(url + endpoint, payload);
        break;
      case "PUT":
        response = await axios.put(url + endpoint, payload);
        break;
      case "DELETE":
        response = await axios.delete(url + endpoint, payload);
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default APIRequest;
