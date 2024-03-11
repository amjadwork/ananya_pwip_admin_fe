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

  { label: "Dashboard", icon: Dashboard, link: "/" },
  {
    label: "Apps",
    icon: Apps,
    initiallyOpened: true,
    links: [
      { label: "Export costing", link: "/export-costing" },
      { label: "OFC (coming soon)", link: "#!" },
    ],
  },
  { label: "Users", icon: User, link: "/user-management" },
  { label: "Plans & Subscription", icon: Article, link: "/plans-management" },
  { label: "Learn", icon: Video, link: "/learn-management" },
  { label: "Tags", icon: Tags, link: "/tags-management" },
  { label: "Logs", icon: ListDetails, link: "/logs-management" },
  { label: "Reporting", icon: PresentationAnalytics, link: "/reports" },
  { label: "Support", icon: Help, link: "/customer-support" },
];
