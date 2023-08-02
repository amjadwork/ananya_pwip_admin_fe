import APIRequest from "../../../helper/api";

export const getOfcData = async () => {
  const response: any = await APIRequest("ofc", "GET");
  if (response) {
    return response;
  }
};

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

export const postOfcData = async (data: any) => {
  const response = await APIRequest("ofc", "POST", data);
  if (response) {
    return response;
  }
};

export const deleteOfcData = async (data: any) => {
  const response = await APIRequest(
    "ofc" + "/" + data._originPortId + "/" + data._id,
    "DELETE"
  );
  if (response) {
    return response;
  }
};

export const patchOfcData = async (data: any) => {
  console.log("here", data)
  const response = await APIRequest(
    "ofc" + "/" + data._originPortId + "/" + data._ofcObjectId,
    "PATCH", data);
  if (response) {
    console.log(response)
    return response;
  }
};


