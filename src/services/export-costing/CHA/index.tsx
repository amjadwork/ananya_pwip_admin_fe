import React from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import APIRequest from "../../../helper/api";
import { Check } from "tabler-icons-react";

export const getChaData = async (regionList: any) => {
  const response: any = await APIRequest("cha", "GET");
  return response;
};

export const getDestinationData = async () => {
  const response = await APIRequest("location?filterType=destination", "GET");
  return response;
};

export const getRegionSource = async () => {
  const response = await APIRequest("location?filterType=origin", "GET");
  return response;
};

export const postChaData = async (chaAPIPayload: any) => {
  showNotification({
    id: "cha-post-data",
    title: "Adding requested CHA record.",
    message: "We are adding the record with the requested data, please wait",
    autoClose: 5000,
    disallowClose: false,
    loading: true,
    styles: (theme) => ({
      root: {
        // backgroundColor: theme.colors.blue[6],
        borderColor: theme.colors.blue[6],

        // "&::before": { backgroundColor: theme.white },
      },

      // title: { color: theme.white },
      // description: { color: theme.white },
      // closeButton: {
      //   color: theme.white,
      //   "&:hover": { backgroundColor: theme.colors.blue[7] },
      // },
    }),
  });
  const response = await APIRequest("cha", "POST", chaAPIPayload);

  if (response) {
    updateNotification({
      id: "cha-post-data",
      icon: <Check size={16} />,
      title: "CHA record has been added.",
      message: "Hey there, your record has been added to the table",
      autoClose: 5000,
      disallowClose: false,
      loading: false,
      styles: (theme) => ({
        root: {
          // backgroundColor: theme.colors.blue[6],
          borderColor: theme.colors.blue[6],

          // "&::before": { backgroundColor: theme.white },
        },

        // title: { color: theme.white },
        // description: { color: theme.white },
        // closeButton: {
        //   color: theme.white,
        //   "&:hover": { backgroundColor: theme.colors.blue[7] },
        // },
      }),
    });
  }

  return response;
};
