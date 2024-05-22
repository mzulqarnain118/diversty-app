import { Box, Paper, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";

const SectionSubmitItem = ({ title, description }: any) => {
  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          border: "1px solid rgba(0,0,0,0.05)",
          p: 3,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Box
          sx={{ px: 4 }}
          component="div"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description || ""),
          }}
        />
      </Paper>
    </Box>
  );
};

export default SectionSubmitItem;
