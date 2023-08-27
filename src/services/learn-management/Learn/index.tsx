import APIRequest from "../../../helper/api";

export const getLearnData = async () => {
  const response: any = await APIRequest("learn", "GET");
  if (response) {
    return response;
  }
};

export const postLearnData = async (data:any) => {
    const response: any = await APIRequest("learn", "POST", data);
    if (response) {
      return response;
    }
  };

  export const deleteLearnData = async (data:any) => {
    const response: any = await APIRequest( "learn" + "/" + data._id, "DELETE");
    if (response) {
      return response;
    }
  };

  export const patchLearnData = async (data: any) => {
    console.log("triggerd")
    const response = await APIRequest(
      "learn" + "/" + data._id,
      "PATCH", data);
    if (response) {
      return response;
    }
  };



