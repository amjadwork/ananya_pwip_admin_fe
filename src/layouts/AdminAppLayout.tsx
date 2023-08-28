import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import {
  Box,
  MantineProvider,
  AppShell,
  Header as HeaderWrapper,
} from "@mantine/core";

import ExportCostingLayout from "./ExportCostingLayout";

import Header from "../components/common/Header";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import PlansManagementLayout from "./PlansManagementLayout";
import LearnManagementLayout from "./LearnManagementLayout";
import TagsManagementLayout from "./TagsManagementLayout";

const AdminAppLayout: React.FC<any> = () => {
  const [opened, setOpened] = useState(false);

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
      <AppShell
        navbarOffsetBreakpoint="md"
        asideOffsetBreakpoint="md"
        fixed
        padding="sm"
        zIndex={0}
        navbar={<SideNavBar opened={opened} action={handleNavigation} />}
        header={
          <HeaderWrapper height={70} p="md">
            <Header
              action={() => null}
              opened={opened}
              onClickBurger={() => setOpened((o) => !o)}
            />
          </HeaderWrapper>
        }
        // footer={
        //   <Footer
        //     height={40}
        //     style={{
        //       width: "100%",
        //     }}
        //     p="sm"
        //     px="md"
        //     color="gray"
        //     fixed={true}
        //     position={{
        //       bottom: 0,
        //       right: 0,
        //     }}
        //   >
        //     <Text size="xs" color="dimmed" align="right">
        //       Export Costing Management by <u>PWIP</u>
        //     </Text>
        //   </Footer>
        // }
        styles={(theme) => ({
          main: {
            minHeight: "95vh",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              paddingLeft: 12,
            },
            paddingLeft: "calc(var(--mantine-navbar-width, 0px))",
          },
        })}
      >
        <Box
          component="div"
          sx={{
            position: "relative",
          }}
        >
          <Routes>
            <Route path="/" element={<div></div>} />
            <Route path="/export-costing/*" element={<ExportCostingLayout />} />
            <Route path="/plans-management/*" element={<PlansManagementLayout />} />
            <Route path="/learn-management/*" element={<LearnManagementLayout />} />
            <Route path="/tags-management/*" element={<TagsManagementLayout />} />
          </Routes>
        </Box>
      </AppShell>
    </MantineProvider>
  );
};

export default AdminAppLayout;
