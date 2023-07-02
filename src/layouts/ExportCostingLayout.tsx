import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import {
  MantineProvider,
  Container,
  Box,
  Tabs,
  createStyles,
} from "@mantine/core";

import ProductsContainer from "../containers/Products";
import ManageProductsContainer from "../containers/ManageProducts";
import LocationsContainer from "../containers/Locations";
import ManagePackageContainer from "../containers/ManagePackage";
import PlaygroundContainer from "../containers/Playground";
import ManageChaContainer from "../containers/ManageCha";
import ManageShlContainer from "../containers/ManageShl";
import ManageOfcContainer from "../containers/ManageOfc";
import ManageTransportContainer from "../containers/ManageTransport";
import ManagePwipServicesContainer from "../containers/ManagePwipService";
import ManageOthersContainer from "../containers/ManageOthers";

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
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2],
    },
  },
}));

const ExportCostingLayout: React.FC<any> = () => {
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
      <Box
        component="div"
        sx={(theme: any) => ({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: theme.colors.gray[1],
          paddingTop: "16px",
        })}
      >
        <Container size={1150}>
          <Tabs
            defaultValue="playground"
            variant="outline"
            classNames={{
              root: classes.tabs,
              tabsList: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>
              {[
                "playground",
                "products",
                "locations",
                "cha",
                "Shl",
                "managePackaging",
                "Ofc",
                "transport",
              ].map((list: any) => {
                return (
                  <Tabs.Tab
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(list === "playground" ? "" : list);
                    }}
                    value={list}
                    sx={{
                      textTransform: "uppercase",
                    }}
                  >
                    {list}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs>
        </Container>
      </Box>
      <Container size={1200}>
        <Routes>
          <Route path="/" element={<PlaygroundContainer />} />
          <Route path="/products" element={<ProductsContainer />} />
          <Route path="/products/:id" element={<ManageProductsContainer />} />
          <Route path="/locations" element={<LocationsContainer />} />
          <Route path="/cha" element={<ManageChaContainer />} />
          <Route path="/Shl" element={<ManageShlContainer />} />
          <Route path="/managePackaging" element={<ManagePackageContainer />} />
          <Route path="/Ofc" element={<ManageOfcContainer />} />
          <Route path="/transport" element={<ManageTransportContainer />} />
          <Route
            path="/pwipServices"
            element={<ManagePwipServicesContainer />}
          />
          <Route path="/others" element={<ManageOthersContainer />} />
        </Routes>
      </Container>
    </MantineProvider>
  );
};

export default ExportCostingLayout;
