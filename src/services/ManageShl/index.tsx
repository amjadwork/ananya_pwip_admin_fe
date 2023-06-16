import APIRequest from "../../helper/api";

export const getShlData = async (regionList: any) => {
    const shlResponse: any = await APIRequest("shl", "GET");
    return shlResponse;

};

export const getRegionSource = async () => {
    const regionResponse = await APIRequest(
      "location?filterType=origin",
      "GET"
    );
    return regionResponse
};

export const getDestinationData = async () => {
    const destinationDataResponse = await APIRequest(
      "location?filterType=destination",
      "GET"
    );
    return destinationDataResponse;
};


export const postShlData = async (shlAPIPayload:any)=>{
    const shlResponse = await APIRequest("shl", "POST", shlAPIPayload);
    return shlResponse;
};