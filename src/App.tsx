import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import DashboardScreen from "./screens/dashboard";

let root = "/admin/dashboard";

let basename = "/";

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path={`${root}/*`} element={<DashboardScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
