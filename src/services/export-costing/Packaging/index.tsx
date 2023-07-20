import APIRequest from "../../../helper/api";

export const getPackagingData = async () => {
  const response: any = await APIRequest("packaging", "GET");
  if (response) {
    return response;
  }
};

export const postPackagingData = async (data: any) => {
  const response = await APIRequest("packaging", "POST", data);
  if (response) {
    return response;
  }
};

export const deletePackagingData = async (data: any) => {
  const response = await APIRequest(
    "packaging" + "/" + data._id,
    "DELETE"
  );
  if (response) {
    return response;
  }
};

export const putPackagingData = async (data: any) => {
  const response = await APIRequest(
    "packaging" + "/" + data._id,
    "PUT", data);
    
  if (response) {
    console.log(response)
    return response;
  }
};

