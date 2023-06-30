import React, { useState } from "react";

import AdminAppLayout from "../../layouts/AdminAppLayout";
import withAuth from "../../hoc/withAuth";
import { ErrorContext } from "../../context/errorContext";

function AdminScreen() {
  const [error, setError] = useState(false);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <AdminAppLayout />;
    </ErrorContext.Provider>
  );
}

export default withAuth(AdminScreen);
