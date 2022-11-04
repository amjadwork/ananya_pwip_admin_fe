import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  headerContainer: {
    width: "100%",
    display: `inline-flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    padding: `0px 12px`,

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      padding: `0px`,
    },
  },
  logoContainer: {
    display: `inline-flex`,
    alignItems: `center`,
    justifyContent: `flex-start`,
  },
  logoText: {
    marginLeft: 20,
    display: `inline-flex`,
  },
  menuItemContainer: {
    width: "100%",
    display: `inline-flex`,
    alignItems: `center`,
    justifyContent: `flex-end`,
  },
  menuItemWrapper: {
    marginLeft: 32,

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: 0,
    },
  },
}));
