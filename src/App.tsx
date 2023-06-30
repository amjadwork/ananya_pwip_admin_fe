import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import DashboardScreen from "./screens/dashboard";
import LoginScreen from "./screens/login";
import OTPScreen from "./screens/otp";

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
            element={<ProtectedRoute element={() => <DashboardScreen />} />}
          />
        </Routes>
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;
