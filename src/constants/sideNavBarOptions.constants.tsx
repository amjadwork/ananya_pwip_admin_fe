import {
  PresentationAnalytics,
  Help,
  Apps,
  User,
  Dashboard,
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
      { label: "OFC (comig soon)", link: "#!" },
    ],
  },
  { label: "Users", icon: User, link: "/user-management" },
  { label: "Reporting", icon: PresentationAnalytics, link: "/reports" },
  { label: "Support", icon: Help, link: "/customer-support" },

  // {
  //   label: "Location",
  //   navigateTo: "/admin/dashboard/locations",
  //   icon: "dollar",
  //   color: "green",
  // },
  // {
  //   label: "Packaging",
  //   navigateTo: "/admin/dashboard/managePackaging",
  //   icon: "calendar",
  //   color: "yellow",
  //   badge: "",
  // },
  // {
  //   label: "CHA",
  //   navigateTo: "/admin/dashboard/cha",
  //   icon: "dice",
  //   color: "red",
  //   badge: "",
  // },
  // {
  //   label: "SHL",
  //   navigateTo: "/admin/dashboard/shl",
  //   icon: "heart",
  //   color: "yellow",
  //   badge: "",
  // },
  // {
  //   label: "OFC",
  //   navigateTo: "/admin/dashboard/ofc",
  //   icon: "star",
  //   color: "blue",
  //   badge: "",
  // },
  // {
  //   label: "Transportation",
  //   navigateTo: "/admin/dashboard/transport",
  //   icon: "disc",
  //   color: "green",
  //   badge: "",
  // },
  // {
  //   label: "PWIP Services",
  //   navigateTo: "/admin/dashboard/pwipServices",
  //   icon: "calendar",
  //   color: "yellow",
  //   badge: "",
  // },
  // {
  //   label: "Others",
  //   navigateTo: "/admin/dashboard/others",
  //   icon: "calendar",
  //   color: "yellow",
  //   badge: "",
  // },
];
