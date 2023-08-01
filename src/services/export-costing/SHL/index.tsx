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

export const getShlData = async () => {
  const response: any = await APIRequest("shl", "GET");
  if (response) {
    return response;
  }
};

export const postShlData = async (data: any) => {
  const response = await APIRequest("shl", "POST", data);
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
    "shl" + "/" + data._originPortId + "/" + data._id,
    "PATCH", data.destinations[0]);
  if (response) {
    return response;
  }
};



