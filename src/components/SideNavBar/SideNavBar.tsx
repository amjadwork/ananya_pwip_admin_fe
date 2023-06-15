import React from "react";
import {
  Badge,
  UnstyledButton,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  Home,
  Disc,
  CurrencyDollar,
  CalendarMinus,
  Heart,
  Dice,
  Star,
} from "tabler-icons-react";

import { Text } from "../../components/index";
import { NavbarOptions } from "../../constants/sideNavBarOptions.constants";
import { useStyles } from "../../styles/components/sideNavBar.style";

interface Props {
  action?: any;
}

const OptionIcons: any = (props: any) => {
  const { icon, color } = props;

  if (icon === "home") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <Home size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "disc") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <Disc size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "dollar") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <CurrencyDollar size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "calendar") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <CalendarMinus size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "chart") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <CalendarMinus size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "heart") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <Heart size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "dice") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <Dice size={20} />
      </ThemeIcon>
    );
  }

  if (icon === "star") {
    return (
      <ThemeIcon variant="light" color={color || "dark"} size="lg">
        <Star size={20} />
      </ThemeIcon>
    );
  }

  return null;
};

const SideNavBar: React.FC<Props> = ({ action }) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  // const router = useRouter();

  const pathName = "/";

  let menuItemWrapper = ``;

  return (
    <div className={classes.optionContainer}>
      <div
        className={classes.menuItemContainer}
        // onClick={() => window?.open("https://particlesnft.io/", "_blank")}
      >
        {NavbarOptions.map((item, index) => {
          if (pathName === item.navigateTo) {
            menuItemWrapper = `${classes.menuItemWrapper} ${classes.active}`;
          } else {
            menuItemWrapper = `${classes.menuItemWrapper}`;
          }

          return (
            <div
              className={menuItemWrapper}
              key={index}
              onClick={() => {
                action(item.navigateTo);
              }}
            >
              <UnstyledButton>
                <div className={classes.unStyledButtonWrapper}>
                  <div className={classes.iconWrapper}>
                    <OptionIcons icon={item.icon} color={item.color} />
                  </div>
                  <Text size="sm" color="dark">
                    {item.option}
                  </Text>
                  {item?.badge && (
                    <div style={{ marginLeft: `${theme.spacing.md}px` }}>
                      <Badge variant="filled" color="pink" size="md">
                        {item?.badge}
                      </Badge>
                    </div>
                  )}
                </div>
              </UnstyledButton>
            </div>
          );
        })}
      </div>
      <div className={classes.menuItemContainer}>
        <div className={classes.menuItemWrapper}>
          <UnstyledButton>
            <div className={classes.unStyledButtonWrapper}>
              <div className={classes.iconWrapper}>
                <ThemeIcon variant="light" color="red" size="lg">
                  <Home size={20} />
                </ThemeIcon>
              </div>
              <Text size="sm" color="dark">
                Support
              </Text>
            </div>
          </UnstyledButton>
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
