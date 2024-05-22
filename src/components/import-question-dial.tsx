import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
const actions = [
  { icon: <ArrowCircleDownIcon />, name: "Import Below", position: "BELOW" },
  { icon: <ArrowCircleUpIcon />, name: "Import Above", position: "ABOVE" },
];

export const ImportQuestionDial = ({
  currentPosition,
  handleImport,
}: {
  currentPosition: number;
  handleImport: (position: "ABOVE" | "BELOW", orderNumber: number) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ position: "relative", width: 40, aspectRatio: 1 }}>
      <SpeedDial
        ariaLabel="add survey item"
        sx={{ position: "absolute", right: 0, bottom: 0 }}
        icon={<SpeedDialIcon icon={<PlayForWorkIcon />} />}
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
            onClick={() => handleImport(action.position as "ABOVE" | "BELOW", currentPosition)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default ImportQuestionDial;
