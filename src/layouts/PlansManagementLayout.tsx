import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import {
  MantineProvider,
  Container,
  Box,
  Tabs,
  createStyles,
} from "@mantine/core";

import ManageSubscription from "../containers/Common/ManageSubscriptions";
import ManagePlans from "../containers/Common/ManagePlans";

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

  const [activeTab, setActiveTab] = React.useState<any>("");

  const tabRoutes = ["subscriptions", "plans"];

  const handleNavigation = (path: string) => {
    navigate(path, { replace: true });
  };

  React.useEffect(() => {
    if (typeof window) {
      const pathArrayFromLocation = window.location.pathname.split("/");
      const tabRoute = pathArrayFromLocation[pathArrayFromLocation.length - 1];

      if (tabRoutes.includes(tabRoute)) {
        setActiveTab(tabRoute);
      } else {
        setActiveTab("subscriptions");
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
          <Route path="/" element={<ManageSubscription />} />
          <Route path="/subscriptions" element={<ManageSubscription />} />
          <Route path="/plans" element={<ManagePlans />} />
        </Routes>
      </Container>
    </MantineProvider>
  );
};

export default PlansManagementLayout;
