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
import ManageContainer from "../containers/ManageContainer";

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

const ExportCostingLayout: React.FC<any> = () => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<any>("");

  const tabRoutes = [
    "playground",
    "products",
    "locations",
    "cha",
    "shl",
    "ofc",
    "transport",
    "packaging",
    "container",
    "others",
  ];

  const handleNavigation = (path: string) => {
    navigate(path, { replace: true });
  };

  React.useEffect(() => {
    if (typeof window) {
      const pathArrayFromLocation = window.location.pathname.split("/");
      const tabRoute = pathArrayFromLocation[pathArrayFromLocation.length - 1];

      if (tabRoutes.includes(tabRoute)) {
        setActiveTab(tabRoute);
      }
    }
  }, []);

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
          backgroundColor: theme.colors.white,
          paddingTop: "16px",
        })}
      >
        <Container size={1150}>
          <Tabs
            value={activeTab}
            variant="outline"
            classNames={{
              root: classes.tabs,
              tabsList: classes.tabsList,
              tab: classes.tab,
            }}
            onTabChange={(value: any) => {
              setActiveTab(value);
            }}
          >
            <Tabs.List>
              {tabRoutes.map((list: any) => {
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
                    {list?.split("-")?.join(" ") || ""}
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
          <Route path="/shl" element={<ManageShlContainer />} />
          <Route path="/ofc" element={<ManageOfcContainer />} />
          <Route path="/transport" element={<ManageTransportContainer />} />
          <Route path="/packaging" element={<ManagePackageContainer />} />
          <Route path="/container" element={<ManageContainer />} />
          <Route path="/others" element={<ManageOthersContainer />} />
        </Routes>
      </Container>
    </MantineProvider>
  );
};

export default ExportCostingLayout;
