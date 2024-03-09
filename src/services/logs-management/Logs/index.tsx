import APIRequest from "../../../helper/api";

export const getLogsData = async () => {
  const response: any = await APIRequest("logs/event-logs-user", "GET");
  if (response) {
    return response;
  }
};
