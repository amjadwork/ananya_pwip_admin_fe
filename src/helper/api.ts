import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { getCookie } from "./helper";

const APIRequest = async (
  endpoint: string,
  method: string,
  payload?: object,
  headers?: object,
  isPublic?: boolean,
  responseType?:string
) => {
  const environment = process.env.REACT_APP_ENV;

  const stageApiURL = process.env.REACT_APP_API_URL_STAGE;
  const localApiURL = process.env.REACT_APP_API_URL_LOCAL;

  const baseURL = environment === "stage" ? stageApiURL : localApiURL;
  const url = baseURL + `/admin/api/`;
  const publicURL = baseURL + `/api/`;

  let apiURL = url;

  if (isPublic) {
    apiURL = publicURL;
  }

  const accessToken = getCookie("access_token");

  try {
    if (!accessToken) {
      showNotification({
        id: "cha-post-data",
        title: `Issue with authentication`,
        message:
          "Not sure what went wrong! but seems like you are not authenticated to see the resources.",
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

      return null;
    }

    // Set authorization header with the access token
    let authHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };

    if (headers && Object.keys(headers).length) {
      authHeaders = {
        ...authHeaders,
        ...headers,
      };
    }

    let response: any = null;
    switch (method) {
      case "GET":
        response = await axios.get(apiURL + endpoint, {
          headers: {
            ...authHeaders,
          },
       
          withCredentials: true,
      
          
        });
        break;
      case "GETEXCEL":
        response = await axios.get(apiURL + endpoint, {
          headers: {
            ...authHeaders,
          },
       
          withCredentials: true,
          responseType:"blob"
          
        });
        break;
      case "POST":
        response = await axios.post(apiURL + endpoint, payload, {
          headers: {
            ...authHeaders,
          },
          withCredentials: true,
        });
        break;
      case "PUT":
        response = await axios.put(apiURL + endpoint, payload, {
          headers: {
            ...authHeaders,
          },
          withCredentials: true,
        });
        break;
      case "PATCH":
        response = await axios.patch(apiURL + endpoint, payload, {
          headers: {
            ...authHeaders,
          },
          withCredentials: true,
        });
        break;
      case "DELETE":
        response = await axios.delete(apiURL + endpoint, {
          headers: {
            ...authHeaders,
          },
          withCredentials: true,
        });
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
