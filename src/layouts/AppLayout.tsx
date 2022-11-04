import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// import { useRouter } from "next/router";
import {
  Container,
  MantineProvider,
  AppShell,
  Navbar,
  Header as HeaderWrapper,
  Footer,
  Text,
} from "@mantine/core";

import ProductsContainer from "../containers/Products";
import ManageProductsContainer from "../containers/ManageProducts";
import LocationsContainer from "../containers/Locations";
import PackagingContainer from "../containers/Packaging";
import PlaygroundContainer from "../containers/Playground";

// import components
import Header from "../components/Header/Header";
import SideNavBar from "../components/SideNavBar/SideNavBar";

const AppLayout: React.FC<any> = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  // const theme = useMantineTheme();

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
        navbar={
          <Navbar
            width={{ base: 300 }}
            p="md"
            hiddenBreakpoint="md"
            hidden={!opened}
            fixed={true}
            position={{
              bottom: 0,
            }}
          >
            <SideNavBar action={handleNavigation} />
          </Navbar>
        }
        header={
          <HeaderWrapper height={70} p="md">
            <Header
              action={() => null}
              opened={opened}
              onClickBurger={() => setOpened((o) => !o)}
            />
          </HeaderWrapper>
        }
        footer={
          <Footer
            height={40}
            style={{
              width: "100%",
            }}
            p="sm"
            px="md"
            color="gray"
            fixed={true}
            position={{
              bottom: 0,
              right: 0,
            }}
          >
            <Text size="xs" color="dimmed" align="right">
              Export Costing Management by <u>PWIP</u>
            </Text>
          </Footer>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              paddingLeft: 12,
            },
          },
        })}
      >
        <Container>
          <Routes>
            <Route path="/" element={<PlaygroundContainer />} />
            <Route path="/products" element={<ProductsContainer />} />
            <Route path="/products/:id" element={<ManageProductsContainer />} />
            <Route path="/locations" element={<LocationsContainer />} />
            <Route path="/packaging" element={<PackagingContainer />} />
          </Routes>
        </Container>
      </AppShell>
    </MantineProvider>
  );
};

export default AppLayout;
