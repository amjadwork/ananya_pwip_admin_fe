import React from "react";
import { Navbar, ScrollArea } from "@mantine/core";

import { NavbarOptions } from "../../constants/sideNavBarOptions.constants";
import { useStyles } from "../../styles/components/sideNavBar.style";

import { UserButton } from "./UserButon";
import { LinksGroup } from "./NavbarLinkGroup";

interface Props {
  action?: any;
  opened?: any;
}

const SideNavBar: React.FC<Props> = ({ action, opened }) => {
  const { classes } = useStyles();

  const links = NavbarOptions.map((item) => {
    return <LinksGroup {...item} key={item.label} action={action} />;
  });

  return (
    <Navbar
      width={{ base: 300 }}
      p="md"
      hiddenBreakpoint="md"
      hidden={!opened}
      fixed={true}
      position={{
        bottom: 0,
      }}
      className={classes.navbar}
    >
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton
          image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          name="Ann Nullpointer"
          email="anullpointer@yahoo.com"
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default SideNavBar;
