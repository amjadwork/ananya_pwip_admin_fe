import APIRequest from "../../../helper/api";


export const getProductData = async () => {
    const productResponse: any = await APIRequest("product", "GET");
  return productResponse
  };

  export const postVariantData = async (payload:any) => {
    const addVariantResponse = await APIRequest("variant", "POST", payload);

    return addVariantResponse
  };


  export const postCategoryData = async (payloadCategory:any) =>{
  const categoryResponse= await APIRequest("category","POST",payloadCategory);

  return categoryResponse;
  };

  export const postProductData = async (payload:any) =>{
    const productResponse= await APIRequest("product","POST",payload);
    
    return productResponse;
    };