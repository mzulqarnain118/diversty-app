import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
const actions = [
  {
    icon: <ArrowCircleDownIcon />,
    name: "Question Below",
    type: "QUESTION",
    position: "BELOW",
  },
  {
    icon: <ArrowCircleUpIcon />,
    name: "Question Above",
    type: "QUESTION",
    position: "ABOVE",
  },
  {
    icon: <ArrowDropDownIcon />,
    name: "Section Below",
    type: "SECTION",
    position: "BELOW",
  },
  {
    icon: <ArrowDropUpIcon />,
    name: "Section Above",
    type: "SECTION",
    position: "ABOVE",
  },
];

export const AddSurveyItemDial = ({
  currentPosition,
  addItem,
}: {
  currentPosition: number;
  addItem: (
    type: "QUESTION" | "SECTION",
    order: number,
    position: "ABOVE" | "BELOW"
  ) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ position: "relative", width: 40, aspectRatio: 1 }}>
      <SpeedDial
        ariaLabel="add survey item"
        sx={{ position: "absolute", right: 0, bottom: 0 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{ size: "small" }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() =>
              addItem(
                action.type as "QUESTION" | "SECTION",
                currentPosition,
                action.position as "ABOVE" | "BELOW"
              )
            }
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default AddSurveyItemDial;
