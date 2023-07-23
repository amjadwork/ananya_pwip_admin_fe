import APIRequest from "../../../helper/api";

export const getOtherChargesData = async () => {
  const response: any = await APIRequest("othercharges", "GET");
  if (response) {
    return response;
  }
};

export const postOtherChargesData = async (data: any) => {
  const response = await APIRequest("othercharges", "POST", data);
  if (response) {
    return response;
  }
};


export const deleteOtherChargesData = async (data:any) => {
    console.log("data", data)
  const response = await APIRequest ("othercharges" + "/" + data._id, "DELETE");
  if (response) {
    return response;
  }
}

export const putOtherChargesData = async (data:any) => {
  const response = await APIRequest ("othercharges" + "/" + data._id, "PUT", data);
  if (response) {
    return response;
  }
}



