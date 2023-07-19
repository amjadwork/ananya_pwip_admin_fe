import APIRequest from "../../../helper/api";

export const getTransportationData = async () => {
  const response: any = await APIRequest("transportation", "GET");
  if (response) {
    return response;
  }
};

export const getSourceData = async () => {
  const response = await APIRequest("location/source", "GET");
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

export const postTransportationData = async (data: any) => {
  const response = await APIRequest(
    "transportation",
    "POST",
    data
  );
  if (response) {
    return response;
  }
};

export const deleteTransportationData = async (data: any) => {
  const response = await APIRequest(
    "transportation" + "/" + data._originPortId + "/" + data._id,
    "DELETE"
  );
  if (response) {
    return response;
  }
};

export const patchTransportationData = async (data: any) => {
  const response = await APIRequest(
    "transportation" + "/" + data[0]._originPortId
    + "/" + data[0]._transportObjId,
    "PATCH", data[0]);
  if (response) {
    console.log(response)
    return response;
  }
};


