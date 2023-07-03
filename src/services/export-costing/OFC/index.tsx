import APIRequest from "../../../helper/api";

export const getOfcData = async (regionList: any) => {
  const response: any = await APIRequest("ofc", "GET");
  if (response) {
    return response;
  }
};

export const getRegionSource = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  if (response) {
    return response;
  }
};

export const getDestinationData = async () => {
  const response = await APIRequest("location?filterType=destination", "GET");
  if (response) {
    return response;
  }
};

export const postOfcData = async (ofcAPIPayload: any) => {
  const response = await APIRequest("ofc", "POST", ofcAPIPayload);
  if (response) {
    return response;
  }
};
