import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import DashboardScreen from "./screens/dashboard";
import LoginScreen from "./screens/login";
import OTPScreen from "./screens/otp";

let root = "/admin/dashboard";

let basename = "/";

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/otp" element={<OTPScreen />} />
        <Route path={`${root}/*`} element={<DashboardScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
