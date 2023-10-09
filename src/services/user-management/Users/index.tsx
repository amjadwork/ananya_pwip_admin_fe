import APIRequest from "../../../helper/api";

export const getUsersData = async () => {
  const response = await APIRequest("/alluser", "GET");
  if (response) {
    return response;
  }
};
export const patchUsersData = async (data: any) => {
  console.log(data, "PATCH DATA")
  const response = await APIRequest(
    "user" + "/" + data._id,
    "PATCH",
    data
  );
  if (response) {
    return response;
  }
};
export const deleteUsersData = async (data: any) => {
    const response = await APIRequest("user" + "/" + data._id, "DELETE");
    if (response) {
      return response;
    }
  };
