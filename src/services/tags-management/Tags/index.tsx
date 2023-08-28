import APIRequest from "../../../helper/api";

export const getTagsData = async () => {
  const response: any = await APIRequest("tags", "GET");
  if (response) {
    return response;
  }
};

export const postTagsData = async (data: any) => {
  const response = await APIRequest("tags", "POST", data);
  if (response) {
    return response;
  }
};

export const deleteTagsData = async (data:any) => {
  const response = await APIRequest ("tags" + "/" + data._id, "DELETE");
  if (response) {
    return response;
  }
}

export const patchTagsData = async (data:any) => {
  const response = await APIRequest ("tags" + "/" + data._id, "PATCH", data);
  if (response) {
    return response;
  }
}



