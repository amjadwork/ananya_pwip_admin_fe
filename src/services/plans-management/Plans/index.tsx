import APIRequest from "../../../helper/api";

export const getPlansData = async () => {
  const response: any = await APIRequest("plans", "GET");
  if (response) {
    return response;
  }
};

export const postPlansData = async (data: any) => {
  const response = await APIRequest("plans", "POST", data);
  if (response) {
    return response;
  }
};


export const deletePlansData = async (data:any) => {
  const response = await APIRequest ("plans" + "/" + data.id, "DELETE");
  if (response) {
    return response;
  }
}

export const putPlansData = async (data:any) => {
  const response = await APIRequest ("plans" + "/" + data.id, "PUT", data);
  if (response) {
    return response;
  }
}



