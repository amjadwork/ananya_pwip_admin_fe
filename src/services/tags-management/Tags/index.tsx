import APIRequest from "../../../helper/api";

export const getTagData = async () => {
  const response: any = await APIRequest("tags", "GET");
  if (response) {
    return response;
  }
};




