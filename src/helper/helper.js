import axios from "axios";
import APIRequest from "./api";

export function setCookie(name, value, days) {
  const expires = days ? `; expires=${days}` : "";
  const sameSite = "; SameSite=None";
  const secure = "; Secure";

  document.cookie = `${name}=${encodeURIComponent(
    value || ""
  )}${expires}${sameSite}${secure}; path=/`;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=/;";
}

export function generateQueryString(params) {
  const queryString = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");

  return queryString;
}

export function getChangedPropertiesFromObject(original, updated) {
  const changedProperties = {};
  for (const key in updated) {
    if (original[key] !== updated[key]) {
      changedProperties[key] = updated[key];
    }
  }

  return changedProperties;
}
export function uploadingMultipleImagesToS3(formValues) {
  return new Promise(async (resolve, reject) => {
    if (formValues.imagesArray && formValues.imagesArray.length > 0) {
      const responseUpdate = [];
      for (const image of formValues.imagesArray) {
        const uri = image.url;
        const path = image.path;
        const file = image.src;
        try {
          const response = await axios
            .put(`${uri}`, file, {
              headers: {
                "Content-Type": "image",
                "x-amz-acl": "public-read",
              },
              transformRequest: [
                function (data, headers) {
                  delete headers.Accept;
                  return data;
                },
              ],
            })
            .then((r) => {
              return path;
            });
          formValues.images.push(response);
        } catch (error) {
          console.error(`Error processing image: ${error}`);
          // Handle error as needed
        }
      }

      resolve(formValues.images);
    } else {
      resolve({ success: true, msg: "nothing to Update" });
    }
  });
}
export function updateIndividualVariantSourceRate(
  variantId,
  sourceRateId,
  price,
  sourceId
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (variantId && sourceRateId && price && sourceId) {
        const endpoint = "variant/" + variantId + "/" + sourceRateId;
        const dataToUpdate = {};

        if (price) {
          dataToUpdate.price = price;
        }

        if (sourceId) {
          dataToUpdate._sourceId = sourceId;
        }
        const updateSourceRate = await APIRequest(
          endpoint,
          "PATCH",
          dataToUpdate
        );
        resolve(updateSourceRate);
      } else {
        resolve({ success: true, msg: "nothing to update" });
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function intersectObjects(refPayload, formValues) {
  const result = {};

  for (const key in refPayload) {
    if (formValues.hasOwnProperty(key)) {
      result[key] = formValues[key];
    }
  }

  return result;
}

export function IsoDateConverter(dateTimeString) {
  if (!dateTimeString) {
    return ""; // or return some default value, depending on your requirements
  }
  const date = new Date(dateTimeString);
  return date.toLocaleString();
}

export const uploadImageToS3 = async (url, file) => {
  try {
    const resImageUpload = await axios.put(url, file, {
      headers: {
        "x-amz-acl": "public-read",
        "Content-Type": "image",
      },
      transformRequest: [
        function (data, headers) {
          delete headers.Accept; // Removing the Accept header
          return data; // Returning the modified data
        },
      ],
    });
    return resImageUpload;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export function camelCaseToTitleCase(str) {
  // If the string is empty, return an empty string
  if (!str) return "";
  // Add space before the uppercase letters preceded by a lowercase letter
  const titleCaseStr = str.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Capitalize the first letter of each word
  return titleCaseStr.replace(/\b\w/g, (char) => char.toUpperCase());
}