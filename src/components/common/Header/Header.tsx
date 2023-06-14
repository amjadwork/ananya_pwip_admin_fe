import React from "react";

import {
  Anchor,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";

import Button from "../Button";
import { HeaderOptions } from "../../../constants/header.constants";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

import { useStyles } from "../../../styles/components/header.style";

interface Props {
  action?: any;
  opened?: boolean;
  onClickBurger?: any;
}

const Header: React.FC<Props> = ({ action, opened = false, onClickBurger }) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const Router = useNavigate();

  return (
    <header className={classes.headerContainer}>
      <div
        className={classes.logoContainer}
        onClick={() => window?.open("https://particlesnft.io/", "_blank")}
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

          <div className={classes.menuItemWrapper}>
            <Button
              onClick={action}
              type="button"
              variant="outline"
              color="blue"
            >
              <Text
                size="sm"
                color="blue"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  Router("/");
                  showNotification({
                    title: "Logged out succesfully",
                    message: "",
                    autoClose: 1500,
                  });
                }}
              >
                Logout
              </Text>
            </Button>
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
