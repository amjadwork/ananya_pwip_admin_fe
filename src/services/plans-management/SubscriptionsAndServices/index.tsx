import APIRequest from "../../../helper/api";

export const getSubscriptionsData = async () => {
  const response: any = await APIRequest("subscriptions", "GET");
  if (response) {
    return response;
  }
};

export const getServicesData = async () => {
  const response: any = await APIRequest("services", "GET");
  if (response) {
    return response;
  }
};

export const postServicesData = async (data: any) => {
  const response = await APIRequest("services", "POST", data);
  if (response) {
    return response;
  }
};


export const deleteServicesData = async (data:any) => {
  const response = await APIRequest ("services" + "/" + data.id, "DELETE");
  if (response) {
    return response;
  }
}

export const putServicesData = async (data:any) => {
  const response = await APIRequest ("services" + "/" + data.id, "PUT", data);
  if (response) {
    return response;
  }
}



