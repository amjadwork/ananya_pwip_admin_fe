import APIRequest from "../../../helper/api";

export const getTransportData = async () => {
  const transportDataResponse: any = await APIRequest("transportation", "GET");
  return transportDataResponse;
};

export const getSourceData = async () => {
  const sourceResponse = await APIRequest("location?filterType=source", "GET");
  return sourceResponse;
};

export const getOriginData = async () => {
  const originResponse = await APIRequest("location?filterType=origin", "GET");
  return originResponse;
};

export const postTransportData = async (transportAPIPayload: any) => {
  const transportResponse = await APIRequest(
    "transportation",
    "POST",
    transportAPIPayload
  );
  return transportResponse;
};
