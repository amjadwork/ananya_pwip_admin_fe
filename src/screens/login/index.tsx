import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as userActions } from "../../redux/ducks/user";
import APIRequest from "../../helper/api";
import { setCookie } from "../../helper/helper";

import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Container,
  Flex,
  Box,
  Space,
  Text,
  Image,
} from "@mantine/core";

import { Card } from "../../components";

import { useNavigate } from "react-router-dom";

const LoginButton = ({ clickHandler }: any) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      radius="sm"
      size="lg"
      type="submit"
      variant="filled"
      bg="#003559"
      onClick={() => {
        clickHandler();
        loginWithRedirect();
      }}
      sx={{
        ":hover": {
          backgroundColor: "#005F81",
        },
      }}
    >
      Login
    </Button>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      radius="xl"
      size="xs"
      type="submit"
      variant="outline"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Logout
    </Button>
  );
};

const LoginScreen = (props: any) => {
  const router = useNavigate();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const [isLoading, setIsLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  const fetchTokenAndLogin = async (loginPayload: any) => {
    const { setUserData } = props;
    setUserData({ ...loginPayload });

    const _tok = await getAccessTokenSilently();

    if (_tok) {
      setCookie("access_token", _tok);
      await loginUser({ ...loginPayload });
    }
  };
  const loginUser = async (payload: any) => {
    setIsLoading(true);
    const loginResponse = await APIRequest("login", "POST", payload, {}, true);
    if (loginResponse && loginResponse.message === "success") {
      setCookie("userData", JSON.stringify(loginResponse?.data), 7);
      setRoleId(loginResponse.data.role_id);
      setIsLoading(false);
      if (
        loginResponse?.data.role_id === process.env.REACT_APP_ADMIN_ROLE_ID ||
        process.env.REACT_APP_MARKETING_ROLE_ID ||
        process.env.REACT_APP_MARKETING_ROLE_ID
      ) {
        router("/admin/dashboard");
      } else {
        router("/access-denied");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTokenAndLogin({ ...user, auth_id: user.sub });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTokenAndLogin({ ...user, auth_id: user.sub });
    }
  }, []);

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#003559",
          maxWidth: "100% !important",
        }}
      >
        <Text color="white">Loading...</Text>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#003559",
        maxWidth: "100% !important",
      }}
    >
      <Card
        p="xl"
        component="div"
        radius="md"
        withBorder
        sx={{
          minWidth: "420px",
          backgroundColor: "#fff",
        }}
      >
        <Flex justify="center" align="center" direction="column">
          <Image
            maw={120}
            mx="auto"
            radius="md"
            src="https://pwip.co/assets/web/img/web/logo.png"
            alt="pwip logo"
          />

          <Space h={52} />

          <Box>
            {isAuthenticated ? (
              <LogoutButton />
            ) : (
              <LoginButton
                clickHandler={() => {
                  setIsLoading(true);
                }}
              />
            )}
          </Box>
        </Flex>
      </Card>
    </Container>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userData.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    ...bindActionCreators(
      {
        ...userActions,
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
