import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ManagePlans from '../containers/Common/ManagePlans';

import {
  MantineProvider,
  Container,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 600,
    height: "38px",
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[1],
    },
  },
}));

const PlansManagementLayout: React.FC<any> = () => {
  const { classes } = useStyles();

  const navigate = useNavigate();


  const handleNavigation = (path: string) => {
    navigate(path, { replace: true });
  };


  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          white: ["#FFFFFF"],
        },
      }}
    >

      <Container size={1200}>
        <Routes>
          <Route path="/" element={<ManagePlans />} />
     
        </Routes>
      </Container>
    </MantineProvider>
  );
};

export default PlansManagementLayout;
