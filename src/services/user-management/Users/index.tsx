import APIRequest from "../../../helper/api";

export const getUsersData = async () => {
  const response = await APIRequest("/alluser", "GET");
  if (response) {
    return response;
  }
};
export const patchUsersData = async (data: any) => {
  const response = await APIRequest("user" + "/" + data.user_id, "PATCH", data);
  if (response) {
    return response;
  }
};
export const deleteUsersData = async (data: any) => {
  const response = await APIRequest("user" + "/" + data.user_id, "DELETE");
  if (response) {
    return response;
  }
};

export const getProfileData = async () => {
  const response = await APIRequest("/allprofile", "GET");
  if (response) {
    return response;
  }
};

export const patchProfileData = async (data: any) => {
  const response = await APIRequest("profile" + "/" + data.user_id, "PATCH", data);
  if (response) {
    return response;
  }
};
