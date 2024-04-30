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
    role: [3, 55, 57, 56],
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
    role: [3, 55, 57, 56],
  },
  {
    label: "Users",
    icon: User,
    link: "/user-management",
    role: [3],
  },
  {
    label: "Plans & Subscription",
    icon: Article,
    link: "/plans-management",
    role: [3],
  },
  { label: "Learn", icon: Video, link: "/learn-management", role: [3] },
  { label: "Tags", icon: Tags, link: "/tags-management", role: [3] },
  {
    label: "Logs",
    icon: ListDetails,
    link: "/logs-management",
    role: [3],
  },
  {
    label: "Reporting",
    icon: PresentationAnalytics,
    link: "/reports",
    role: [3, 55, 57, 56],
  },
  {
    label: "Support",
    icon: Help,
    link: "/customer-support",
    role: [3, 55, 57, 56],
  },
];
