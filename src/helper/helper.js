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
        const publicURI = image.publicUrl;
        const file = image.src;

        try {
          const response = await axios.put(`${uri}`, file).then((r) => {
            return publicURI;
          });
          formValues.images[image.index] = response;
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
export function updateIndividualVariantSourceRate(variantId, sourceRateId, price, sourceId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (variantId && sourceRateId && price && sourceId) {
        const endpoint =
          'variant/'+ variantId +
          "/" +
          sourceRateId;
          const dataToUpdate = {};

        if (price) {
          dataToUpdate.price = price;
        }

        if (sourceId) {
          dataToUpdate._sourceId = sourceId;
        }
        const updateSourceRate = await APIRequest(endpoint, "PATCH", dataToUpdate);
        resolve(updateSourceRate);
      } else {
        resolve({ success: true, msg: "nothing to update" });
      }
    } catch (error) {
      reject(error)
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
