import React, { useState } from "react";
import { Alert, Container, Card, Button, Text } from "@mantine/core";
import { ErrorContext } from "../../context/errorContext";

import { useAuth0 } from "@auth0/auth0-react";
import withAuth from "../../hoc/withAuth";
import { Lock } from "tabler-icons-react";
import { deleteCookie } from "../../helper/helper";

function AccessDeniedScreen() {
  const [error, setError] = useState(false);

  const { logout } = useAuth0();

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    maxWidth: "100vh",
  };

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <Container style={containerStyle}>
        <Card>
          <Alert
            color="red"
            style={{ width: "600px", height: "300px", paddingTop: "20px" }}
          >
            <div style={{ display: "flex", paddingLeft: "15rem" }}>
              <Lock size={80} strokeWidth={2} color={"red"} />
            </div>
            <Text
              align="center"
              color="gray"
              style={{
                fontWeight: "bold",
                fontSize: "30px",
                paddingTop: "15px",
              }}
            >
              403: You are not permitted to see this.
            </Text>
            <Text
              align="center"
              style={{ fontWeight: "normal", fontSize: "18px" }}
            >
              The page you are trying to access has restricted access.
            </Text>
            <Text
              align="center"
              style={{ fontWeight: "normal", fontSize: "15px" }}
            >
              If you feel this is a mistake, contact your admin
            </Text>
            <div
              style={{ display: "flex", padding: "2rem", paddingLeft: "10rem" }}
            >
              <Button
                onClick={() => {
                  logout({
                    logoutParams: { returnTo: window.location.origin },
                  });
                  deleteCookie("access_token");
                }}
                variant="outline"
                color="red"
                sx={{
                  ":hover": {
                    backgroundColor: "#FFCCCB",
                    color: "blue",
                  },
                }}
              >
                Sign in with different account
              </Button>
            </div>
          </Alert>
        </Card>
      </Container>
    </ErrorContext.Provider>
  );
}

export default withAuth(AccessDeniedScreen);
