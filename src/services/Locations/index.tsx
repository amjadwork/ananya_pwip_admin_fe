
import APIRequest from "../../helper/api";

export const getLocationData = async () => {
    const locationResponse: any = await APIRequest("location", "GET");
   return locationResponse;
  };

 export const submitLocationData = async (payload: any) => {
    const addLocationResponse: any = await APIRequest(
      "location",
      "POST",
      payload
    );
    return addLocationResponse;
  };

