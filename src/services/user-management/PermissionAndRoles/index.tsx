import APIRequest from "../../../helper/api";

export const getPermissionsData = async () => {
  const response = await APIRequest("permissions", "GET");
  if (response) {
    return response;
  }
};

export const postPermissionsData = async (data: any) => {
  const response = await APIRequest("permissions", "POST", data);
  if (response) {
    return response;
  }
};
export const putPermissionsData = async (data: any) => {
  const response = await APIRequest(
    "permissions" + "/" + data._id,
    "PUT",
    data
  );
  if (response) {
    return response;
  }
};
export const deletePermissionsData = async (data: any) => {
  const response = await APIRequest("permissions" + "/" + data._id, "DELETE");
  if (response) {
    return response;
  }
};
export const getRolesData = async () => {
  const response = await APIRequest("roles", "GET");
  if (response) {
    return response;
  }
};

export const postRolesData = async (data: any) => {
  const response = await APIRequest("roles", "POST", data);
  if (response) {
    return response;
  }
};

export const deleteRolesData = async (data: any) => {
  const response = await APIRequest(
    "roles" + "/" + data._id,
    "DELETE",
    data._id
  );
  if (response) {
    return response;
  }
};

export const putRolesData = async (data: any) => {
  const response = await APIRequest("roles" + "/" + data._id, "PUT", data);
  if (response) {
    return response;
  }
};

export const getRoleAndPermissionsData = async (id: any) => {
  const response = await APIRequest(`rolepermission?role_id=${id}`, "GET");
  if (response) {
    return response;
  }
};

export const postRoleAndPermissionsData = async (data: any) => {
  const response = await APIRequest("rolepermission", "POST", data);
  if (response) {
    return response;
  }
};

export const putRoleAndPermissionsData = async (data: any) => {
  const response = await APIRequest(
    "rolepermission" + "/" + data.roleId,
    "PUT",
    data
  );
  if (response) {
    return response;
  }
};
