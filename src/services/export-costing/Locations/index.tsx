import APIRequest from "../../../helper/api";

export const getLocationData = async () => {
  const locationResponse: any = await APIRequest("location", "GET");
  return locationResponse;
};

export const submitLocationData = async (payload: any) => {
  const addLocationResponse: any = await APIRequest(
    "location",
    "POST",
    payload
  );
  return addLocationResponse;
};

//get list of destination
export const getDestinationData = async () => {
  const destinationDataResponse = await APIRequest(
    "location?filterType=destination",
    "GET"
  );
  return destinationDataResponse;
};

//to get list of Origin
export const getOriginData = async () => {
  const originDataResponse = await APIRequest("location?filterType=origin", "GET");
  return originDataResponse;
};

//to get list of source
export const getSourceData = async () => {
  const sourceDataResponse = await APIRequest("location?filterType=source", "GET");
  return sourceDataResponse;
};
