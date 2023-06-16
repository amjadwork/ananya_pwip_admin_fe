import APIRequest from "../../../helper/api";

export const getShlData = async (regionList: any) => {
  const response: any = await APIRequest("shl", "GET");
  return response;
};

export const getRegionSource = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  return response;
};

export const getDestinationData = async () => {
  const response = await APIRequest(
    "location?filterType=destination",
    "GET"
  );
  return response;
};

export const postShlData = async (shlAPIPayload: any) => {
  const response = await APIRequest("shl", "POST", shlAPIPayload);
  return response;
};
