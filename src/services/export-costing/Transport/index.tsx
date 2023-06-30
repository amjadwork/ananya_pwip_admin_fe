import APIRequest from "../../../helper/api";

export const getTransportData = async () => {
  const response: any = await APIRequest("transportation", "GET");
  return response;
};

export const getSourceData = async () => {
  const response = await APIRequest("location?filterType=source", "GET");
  return response;
};

export const getOriginData = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  return response;
};

export const postTransportData = async (transportAPIPayload: any) => {
  const response = await APIRequest(
    "transportation",
    "POST",
    transportAPIPayload
  );
  return response;
};
