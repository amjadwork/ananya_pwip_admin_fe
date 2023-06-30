import APIRequest from "../../../helper/api";

export const getChaData = async (regionList: any) => {
  const response: any = await APIRequest("cha", "GET");
  return response;
};

export const getDestinationData = async () => {
  const response = await APIRequest(
    "location?filterType=destination",
    "GET"
  );
  return response;
};

export const getRegionSource = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  return response;
};

export const postChaData = async (chaAPIPayload: any) => {
  const response = await APIRequest("cha", "POST", chaAPIPayload);
  return response;
};
