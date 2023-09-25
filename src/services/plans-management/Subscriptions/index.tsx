import APIRequest from "../../../helper/api";

export const getSubscriptionsData = async () => {
  const response: any = await APIRequest("subscriptions", "GET");
  if (response) {
    return response;
  }
};
