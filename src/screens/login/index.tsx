import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as userActions } from "../../redux/ducks/user";

import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Container,
  Grid,
  Space,
  Text,
  AspectRatio,
} from "@mantine/core";

import { Card } from "../../components";

import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      radius="xl"
      size="xs"
      type="submit"
      variant="outline"
      onClick={() => loginWithRedirect()}
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
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    const { setUserData } = props;

    if (isAuthenticated && user) {
      setUserData({ ...user });
      router("/admin/dashboard");
    }
  }, [isAuthenticated, user]);

  return (
    <Container>
      <AspectRatio ratio={290 / 182} sx={{ maxWidth: 300 }} mx="auto">
        <img src="https://admin-uat.pwip.co/assets/logo.png"></img>
      </AspectRatio>
      <Space h={80} />

      <Card p="lg" component="div" radius="md" withBorder>
        <Grid>
          <Grid.Col span={6} offset={5}>
            <Text>Login on EC Admin</Text>
          </Grid.Col>
          <Space h={80} />

          <Grid.Col span={6} offset={5}>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </Grid.Col>
        </Grid>
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
