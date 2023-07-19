import APIRequest from "../../../helper/api";

export const getOriginData = async () => {
  const response = await APIRequest("location/origin", "GET");
  if (response) {
    return response;
  }
};

export const getDestinationData = async () => {
  const response = await APIRequest("location/destination", "GET");
  if (response) {
    return response;
  }
};

export const getShlData = async (regionList: any) => {
  const response: any = await APIRequest("shl", "GET");
  if (response) {
    return response;
  }
};

export const postShlData = async (shlAPIPayload: any) => {
  const response = await APIRequest("shl", "POST", shlAPIPayload);
  if (response) {
    return response;
  }
};

export const deleteShlData = async (data: any) => {
  const response = await APIRequest(
    "shl" + "/" + data._originPortId + "/" + data._id,
    "DELETE"
  );
  if (response) {
    return response;
  }
};

export const patchShlData = async (data: any) => {
  const response = await APIRequest(
    "shl" + "/" + data[0]._originPortId + "/" + data[0]._id,
    "PATCH", data[0]);
  if (response) {
    console.log(response)
    return response;
  }
};

