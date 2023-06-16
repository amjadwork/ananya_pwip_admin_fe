import APIRequest from "../../helper/api";

export const getOfcData = async (regionList: any) => {
    const ofcResponse: any = await APIRequest("ofc", "GET");
    return  ofcResponse;
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


export const postOfcData = async (ofcAPIPayload:any)=>{
    const ofcResponse = await APIRequest("ofc", "POST", ofcAPIPayload);
    return ofcResponse;
};