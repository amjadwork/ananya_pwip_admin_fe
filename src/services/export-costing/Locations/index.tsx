import APIRequest from "../../../helper/api";

export const getAllLocationData = async () => {
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
  const response = await APIRequest("location/destination", "GET");
  if (response) {
    return response;
  }
};

//to get list of Origin
export const getOriginData = async () => {
  const response = await APIRequest("location/origin", "GET");
  if (response) {
    return response;
  }
};

//to get list of source
export const getSourceData = async () => {
  const response = await APIRequest("location/source", "GET");
  if (response) {
    return response;
  }
};

export const getLocationData = async (locationType:any) => {
  const response = await APIRequest(`location/${locationType}`+ "/" , "GET");
  if (response) {
    return response;
  }
};


//to delete any row of the table
export const deleteLocationData = async (data:any, locationType:any) => {
  const response = await APIRequest(`location/${locationType}`+ "/" + data._id , "DELETE");
  if (response) {
    return response;
  }
};

//to add new row in the table
export const postLocationData = async (data:any, locationType:any) => {
  const response = await APIRequest(`location/${locationType}`, "POST", data);
  if (response) {
    return response;
  }
};

//to update row in the table
export const patchLocationData = async (data:any, locationType:any) => {
  const response = await APIRequest(`location/${locationType}` + "/" + data._id, "PATCH", data);
  if (response) {
    return response;
  }
};