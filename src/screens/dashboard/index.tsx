import React from "react";

import AppLayout from "../../layouts/AppLayout";
import withAuth from "../../hoc/withAuth";

function DashboardScreen() {
  return <AppLayout />;
}

export default withAuth(DashboardScreen);
