import APIRequest from "../../helper/api";

export const getChaData = async (regionList: any) => {
    const chaDataResponse: any = await APIRequest("cha", "GET");
    return chaDataResponse;
};

export const getDestinationData = async () => {
    const destinationDataResponse = await APIRequest(
      "location?filterType=destination",
      "GET"
    );
    return destinationDataResponse;
};

export const getRegionSource = async () => {
    const regionResponse = await APIRequest(
      "location?filterType=origin",
      "GET"
    );
    return regionResponse
};

export const postChaData = async (chaAPIPayload:any)=>{
    const chaResponse = await APIRequest("cha", "POST", chaAPIPayload);
    return chaResponse;
};