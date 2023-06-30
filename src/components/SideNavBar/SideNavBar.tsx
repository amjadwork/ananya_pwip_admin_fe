import React from "react";
import { Navbar, ScrollArea } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";

import { NavbarOptions } from "../../constants/sideNavBarOptions.constants";
import { useStyles } from "../../styles/components/sideNavBar.style";

import { UserButton } from "./UserButon";
import { LinksGroup } from "./NavbarLinkGroup";

interface Props {
  action?: any;
  opened?: any;
}

const SideNavBar: React.FC<Props> = ({ action, opened }) => {
  const { user } = useAuth0();
  const { classes } = useStyles();

  console.log(user);

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
        {user && (
          <UserButton
            image={user.picture}
            name={user.name || ""}
            email={user.email || ""}
          />
        )}
      </Navbar.Section>
    </Navbar>
  );
};

export default SideNavBar;
