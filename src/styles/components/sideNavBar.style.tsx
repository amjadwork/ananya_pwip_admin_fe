import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)` + "px",
    marginRight: `calc(${theme.spacing.md} * -1)` + "px",
  },

  linksInner: {
    paddingTop: theme.spacing.xl + "px",
    paddingBottom: theme.spacing.xl + "px",
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));
