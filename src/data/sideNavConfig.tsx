import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/solid/ClipboardDocumentListIcon";
import NewsPaper from "@heroicons/react/24/solid/NewspaperIcon";
import BuildingLibraryIcon from "@heroicons/react/24/solid/BuildingLibraryIcon";
import { SvgIcon } from "@mui/material";
const items = [
  {
    title: "Overview",
    adminOnly: false,
    path: "/dashboard",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "My Surveys",
    adminOnly: false,
    path: "/survey",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentListIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Library",
    adminOnly: false,
    path: "/library",
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    ),
  },
  {
    title: "My GDPR",
    adminOnly: true,
    path: "/gdpr-template",
    icon: (
      <SvgIcon fontSize="small">
        <NewsPaper />
      </SvgIcon>
    ),
  },
  {
    title: "My Tags",
    adminOnly: true,
    path: "/tags",
    icon: (
      <SvgIcon fontSize="small">
        <NewsPaper />
      </SvgIcon>
    ),
  },
];

export { items };
