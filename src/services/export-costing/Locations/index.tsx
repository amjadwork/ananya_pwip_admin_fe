import APIRequest from "../../../helper/api";

export const getLocationData = async () => {
  const response: any = await APIRequest("location", "GET");
  if (response) {
    return response;
  }
};

export const submitLocationData = async (payload: any) => {
  const response: any = await APIRequest("location", "POST", payload);
  if (response) {
    return response;
  }
};

//get list of destination
export const getDestinationData = async () => {
  const response = await APIRequest("location?filterType=destination", "GET");
  if (response) {
    return response;
  }
};

//to get list of Origin
export const getOriginData = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  if (response) {
    return response;
  }
};

//to get list of source
export const getSourceData = async () => {
  const response = await APIRequest("location?filterType=source", "GET");
  if (response) {
    return response;
  }
};
