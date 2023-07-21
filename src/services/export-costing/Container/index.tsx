import APIRequest from "../../../helper/api";

export const getContainerData = async () => {
  const response: any = await APIRequest("container", "GET");
  if (response) {
    return response;
  }
};

export const postContainerData = async (data: any) => {
  const response = await APIRequest("container", "POST", data);
  if (response) {
    return response;
  }
};


export const deleteContainerData = async (data:any) => {
  const response = await APIRequest ("container" + "/" + data._id, "DELETE");
  if (response) {
    return response;
  }
}

export const putContainerData = async (data:any) => {
  const response = await APIRequest ("container" + "/" + data._id, "PUT", data);
  if (response) {
    return response;
  }
}



