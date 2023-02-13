import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import DashboardScreen from "./screens/dashboard";
import Login from "./screens/login/LoginForm";
import Otp from "./screens/login/Otp";

let root = "/admin/dashboard";

let basename = "/";

function App() {
  return (
    
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path={`${root}/*`} element={<DashboardScreen />} />
      </Routes>
    </Router>
    
  );
}

export default App;
