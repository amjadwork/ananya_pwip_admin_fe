import axios from "axios";
import { showNotification, updateNotification } from "@mantine/notifications";

const APIRequest = async (
  endpoint: string,
  method: string,
  payload?: object
) => {
  // const url = `http://43.205.147.191:8000/api/`;
  const url = `http://localhost:8000/api/`;

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
      case "PATCH":
        response = await axios.put(url + endpoint, payload);
        break;
      case "DELETE":
        response = await axios.delete(url + endpoint, payload);
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      showNotification({
        id: "cha-post-data",
        title: `${error.code}: ${error.name}`,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Not sure what went wrong! Contact support",
        autoClose: 5000,
        disallowClose: false,
        loading: false,
        styles: (theme) => ({
          root: {
            borderColor: theme.colors.red[6],

            "&::before": { backgroundColor: theme.colors.red[6] },
          },

          title: { color: theme.colors.red[8] },
        }),
      });
    }
  }
};

export default APIRequest;
