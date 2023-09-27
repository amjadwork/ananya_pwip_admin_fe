import APIRequest from "../../../helper/api";

export const getSubscriptionsData = async () => {
  const response = await APIRequest("subscription", "GET");
  if (response) {
    return response;
  }
};

export const getServicesData = async () => {
  const response = await APIRequest("services", "GET");
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

export const deleteServicesData = async (data: any) => {
  const response = await APIRequest("services" + "/" + data.id, "DELETE");
  if (response) {
    return response;
  }
};

export const patchServicesData = async (data: any) => {
  const response = await APIRequest("services" + "/" + data.id, "PATCH", data);
  if (response) {
    return response;
  }
};
