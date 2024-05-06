import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import AdminScreen from "./screens/admin";
import LoginScreen from "./screens/login";
import AccessDeniedScreen from "./screens/access-denied";
import OldAdminPanelScreen from "./screens/old-admin";

import ProtectedRoute from "./auth/protected-route";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";

let root = "/admin/dashboard";

let basename = "/";

function App() {
  return (
    <Router basename={basename}>
      <Auth0ProviderWithHistory>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route
            path={`${root}/*`}
            element={<ProtectedRoute element={() => <AdminScreen />} />}
          />
          <Route
            path={`/*`}
            element={<ProtectedRoute element={() => <AccessDeniedScreen />} />}
          />
          <Route path={`/old-admin`} element={<OldAdminPanelScreen />} />
        </Routes>
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;
