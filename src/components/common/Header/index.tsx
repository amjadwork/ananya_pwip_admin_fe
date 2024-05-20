import React from "react";
import {
  Anchor,
  MediaQuery,
  Burger,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import { Logout } from "tabler-icons-react";
import { useAuth0 } from "@auth0/auth0-react";

import { Text } from "../../index";
import { HeaderOptions } from "../../../constants/header.constants";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { deleteCookie } from "../../../helper/helper";

import { useStyles } from "../../../styles/components/header.style";

interface Props {
  action?: any;
  opened?: boolean;
  onClickBurger?: any;
}

const Header: React.FC<Props> = ({ action, opened = false, onClickBurger }) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { logout } = useAuth0();

  return (
    <header className={classes.headerContainer}>
      <div
        className={classes.logoContainer}
        onClick={() => {
          window.location.href = "/admin/dashboard";
        }}
      >
        <img
          width={36}
          height={36}
          style={{ objectFit: "contain" }}
          src="/assets/images/logo.png"
          alt="pwip logo"
        />
      </div>
      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <div className={classes.menuItemContainer}>
          {HeaderOptions.map((item: any, index: number) => (
            <div className={classes.menuItemWrapper} key={index}>
              <Anchor href={item.href} color="dark" target={item.target}>
                <Text size="sm" color="dark">
                  {item.option}
                </Text>
              </Anchor>
            </div>
          ))}

          {window.location.pathname === "/old-admin" ? (
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                // window.location.href = "/admin/dashboard";
                navigate("/admin/dashboard");
              }}
              className={classes.menuItemWrapper}
            >
              <Text size="sm" color="dark">
                Back to new panel
              </Text>
            </div>
          ) : (
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                // window.location.href = "/old-admin";
                navigate("/old-admin");
              }}
              className={classes.menuItemWrapper}
            >
              <Text size="sm" color="dark">
                Old admin
              </Text>
            </div>
          )}

          <div className={classes.menuItemWrapper}>
            <ActionIcon
              onClick={() => {
                logout({ logoutParams: { returnTo: window.location.origin } });
                deleteCookie("access_token");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("permissions");
                sessionStorage.removeItem("forexRate");
                // Router("/");
                showNotification({
                  title: "Logged out succesfully",
                  message: "",
                  autoClose: 1500,
                });
              }}
              variant="light"
              color="blue"
            >
              <Logout size={16} />
            </ActionIcon>
          </div>
        </div>
      </MediaQuery>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Burger
          opened={opened}
          onClick={onClickBurger}
          size="sm"
          color={theme.colors.gray[6]}
          mr="xl"
          style={{ marginRight: 0 }}
        />
      </MediaQuery>
    </header>
  );
};

export default Header;
