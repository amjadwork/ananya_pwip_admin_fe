import APIRequest from "../../helper/api";

export const getUserOverviewData = async () => {
  const response: any = await APIRequest("user-overview", "GET");
  if (response) {
    return response;
  }
};
