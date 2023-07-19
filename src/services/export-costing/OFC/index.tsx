import APIRequest from "../../../helper/api";

export const getOfcData = async (regionList: any) => {
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

export const postOfcData = async (ofcAPIPayload: any) => {
  const response = await APIRequest("ofc", "POST", ofcAPIPayload);
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
  const response = await APIRequest(
    "ofc" + "/" + data[0]._originPortId + "/" + data[0]._ofcObjectId,
    "PATCH", data[0]);
  if (response) {
    console.log(response)
    return response;
  }
};


