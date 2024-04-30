import {
  PresentationAnalytics,
  ListDetails,
  Help,
  Apps,
  User,
  Article,
  Video,
  Dashboard,
  Tags,
} from "tabler-icons-react";

export const NavbarOptions = [
  // {
  //   label: "Dashboard",
  //   navigateTo: "/admin/dashboard",
  //   icon: "dashboard",
  //   color: "blue",
  //   badge: "",
  // },
  // {
  //   label: "Products",
  //   navigateTo: "/admin/dashboard/export-costing",
  //   icon: "disc",
  //   color: "teal",
  //   badge: "",
  //   links: [
  //     { label: "Export Costing", navigateTo: "/export-costing" },
  //     { label: "OFC", navigateTo: "!#" },
  //   ],
  // },

  {
    label: "Dashboard",
    icon: Dashboard,
    link: "/dashboard",
    role: [
      process.env.REACT_APP_ADMIN_ROLE_ID,
      process.env.REACT_APP_OPS_ROLE_ID,
    ],
  },
  {
    label: "Apps",
    icon: Apps,
    initiallyOpened: true,
    links: [
      {
        label: "Export costing",
        link: "/export-costing",
      },
      // { label: "OFC (coming soon)", link: "#!" },
    ],
    role: [
      process.env.REACT_APP_ADMIN_ROLE_ID,
      process.env.REACT_APP_OPS_ROLE_ID,
    ],
  },
  {
    label: "Users",
    icon: User,
    link: "/user-management",
    role: [process.env.REACT_APP_ADMIN_ROLE_ID],
  },
  {
    label: "Plans & Subscription",
    icon: Article,
    link: "/plans-management",
    role: [process.env.REACT_APP_ADMIN_ROLE_ID],
  },
  {
    label: "Learn",
    icon: Video,
    link: "/learn-management",
    role: [process.env.REACT_APP_ADMIN_ROLE_ID],
  },
  {
    label: "Tags",
    icon: Tags,
    link: "/tags-management",
    role: [process.env.REACT_APP_ADMIN_ROLE_ID],
  },
  {
    label: "Logs",
    icon: ListDetails,
    link: "/logs-management",
    role: [process.env.REACT_APP_ADMIN_ROLE_ID],
  },
  {
    label: "Reporting",
    icon: PresentationAnalytics,
    link: "/reports",
    role: [
      process.env.REACT_APP_ADMIN_ROLE_ID,
    ],
  },
  {
    label: "Support",
    icon: Help,
    link: "/customer-support",
    role: [
      process.env.REACT_APP_ADMIN_ROLE_ID,
      process.env.REACT_APP_OPS_ROLE_ID,
    ],
  },
];
