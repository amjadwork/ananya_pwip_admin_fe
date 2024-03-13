import APIRequest from "../../../helper/api";

export const getVariantProfileData = async () => {
  const response: any = await APIRequest(
    "service/rice-price/variant-profiles",
    "GET"
  );
  return response;
};
