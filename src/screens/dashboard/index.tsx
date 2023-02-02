import React , { useState }  from "react";

import AppLayout from "../../layouts/AppLayout";
import withAuth from "../../hoc/withAuth";
import {ErrorContext} from './../../context/errorContext';


function DashboardScreen() {
  const [error, setError] = useState(false);
  return(
  <ErrorContext.Provider value={{ error, setError }}>
   <AppLayout />;
   </ErrorContext.Provider>)
}

export default withAuth(DashboardScreen);
