import APIRequest from "../../../helper/api";

export const getProductData = async () => {
    const response: any = await APIRequest("product", "GET");

    return response
};

export const getSpecificCategoryData= async (productId:any) => {
    const response = await APIRequest(
        `category?_productId=${productId}`,
        "GET"
      );

    return response
}

export const getSpecificVariantData= async(categoryIds:any)=>{
    const response= await APIRequest(
        `variant?_categoryId=${categoryIds}`,
        "GET"
      );
      return response
};

export const getPackagingData= async()=>{
    const response = await APIRequest(`packaging`, "GET");
    return response
};
