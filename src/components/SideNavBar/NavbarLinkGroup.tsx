import React from "react";
import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 600,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    paddingLeft: "32px",
    marginLeft: "30px",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  active: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
  },

  inactive: {
    backgroundColor: theme.colors.white,
  },
}));

interface LinksGroupProps {
  icon?: any;
  label?: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
  action?: any;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  link,
  links,
  action,
}: LinksGroupProps) {
  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const [activeMenu, setActiveMenu] = useState<any>("");
  const ChevronIcon = theme.dir === "ltr" ? ChevronRight : ChevronLeft;

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component="span"
      className={classes.link}
      key={link.label}
      onClick={(event) => {
        event.preventDefault();
        action("/admin/dashboard" + link.link);
        // setActiveMenu(link.link);
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={`${classes.control}`}
      >
        <Group
          position="apart"
          spacing={0}
          onClick={(event) => {
            event.preventDefault();
            if (link) {
              setActiveMenu(link);
              action("/admin/dashboard" + link);
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={"1.5rem"}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                  : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
