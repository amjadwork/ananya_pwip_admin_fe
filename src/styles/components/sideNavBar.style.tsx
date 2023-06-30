import { createStyles } from "@mantine/core";

// export const useStyles = createStyles((theme, _params, getRef) => ({
//   optionContainer: {
//     width: "100%",
//     height: "100%",
//     display: `inline-flex`,
//     flexDirection: `column`,
//     alignItems: `center`,
//     justifyContent: `space-between`,
//   },
//   logoContainer: {
//     display: `inline-flex`,
//     alignItems: `center`,
//     justifyContent: `flex-start`,
//   },
//   logoText: {
//     marginLeft: 20,
//     display: `inline-flex`,
//   },
//   menuItemContainer: {
//     width: "100%",
//     display: `inline-flex`,
//     flexDirection: `column`,
//     alignItems: `flex-start`,
//     justifyContent: `flex-start`,
//   },
//   menuItemWrapper: {
//     padding: 10,
//     width: "100%",
//     cursor: "pointer",
//     borderRadius: theme.radius.sm,

//     "&:hover": {
//       backgroundColor: theme.colors.gray[0],
//     },
//   },
//   active: {
//     backgroundColor: theme.colors.gray[0],
//   },
//   unStyledButtonWrapper: {
//     display: "inline-flex",
//     alignItems: "center",
//   },
//   iconWrapper: {
//     display: "inline-flex",
//     marginRight: 20,
//   },
// }));

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
