import APIRequest from "../../../helper/api";

export const getTransportData = async () => {
  const response: any = await APIRequest("transportation", "GET");
  if (response) {
    return response;
  }
};

export const getSourceData = async () => {
  const response = await APIRequest("location?filterType=source", "GET");
  if (response) {
    return response;
  }
};

export const getOriginData = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  if (response) {
    return response;
  }
};

export const postTransportData = async (transportAPIPayload: any) => {
  const response = await APIRequest(
    "transportation",
    "POST",
    transportAPIPayload
  );
  if (response) {
    return response;
  }
};
