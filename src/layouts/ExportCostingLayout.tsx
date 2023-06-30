import React from "react";
import { Route, Routes } from "react-router-dom";

import { Container, MantineProvider } from "@mantine/core";

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

const ExportCostingLayout: React.FC<any> = () => {
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
      <Container>
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
