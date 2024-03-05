import APIRequest from "../../../helper/api";

export const getChaData = async () => {
  const response: any = await APIRequest("cha", "GET");
  if (response) {
    if (response) {
      return response;
    }
  }
};

export const postChaData = async (data: any) => {
  const response = await APIRequest("cha", "POST", data);
  if (response) {
    return response;
  }
};

export const patchChaData = async (data: any) => {
  const response = await APIRequest(
    "cha" + "/" + data._originPortId + "/" + data._id,
    "PATCH", data.destinations[0]);
  if (response) {
    return response;
  }
};

export const deleteChaData = async (data: any) => {
  const response = await APIRequest(
    "cha" + "/" + data._originPortId + "/" + data._id,
    "DELETE"
  );
  if (response) {
    return response;
  }
};

