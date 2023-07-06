import { type } from "os";
import APIRequest from "../../../helper/api";

//Products Module
export const getProductData = async () => {
  const response: any = await APIRequest("product", "GET");
  return response;
};

export const postVariantData = async (payload: any) => {
  const response = await APIRequest("variant", "POST", payload);
  return response;
};

export const postCategoryData = async (payloadCategory: any) => {
  const response = await APIRequest("category", "POST", payloadCategory);
  if (response) {
    return response;
  }
};

export const postProductData = async (payload: any) => {
  const response = await APIRequest("product", "POST", payload);
  return response;
};

//ManageProducts Module
export const putProductData = async (payload: any, productData: any) => {
  const response = await APIRequest(
    `product/${productData._id}`,
    "PUT",
    payload
  );
  return response;
};

export const getSpecificProductData = async (productId: any) => {
  const response = await APIRequest(`product/${productId}`, "GET");
  return response;
};

export const getSpecificCategoryData = async (productId: any) => {
  const response = await APIRequest(`category?_productId=${productId}`, "GET");
  return response;
};

export const getSpecificVariantData = async (categoryIds: any) => {
  const response = await APIRequest(
    `variant?_categoryId=${categoryIds}`,
    "GET"
  );
  return response;
};

export const deleteSpecificVariantData = async (data: any) => {

  console.log("data",data);
  const response = await APIRequest(
    "variant" + "/" + data._variantId + "/" + data._id,
    "DELETE"
  );
  return response;
};

// export const addVariantData = async(payload:any) =>{ const response= await APIRequest(
//   "variant",
//   modalType === "add" ? "POST" : "PATCH",
//   payload
// );
//  return response;
// };
