import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, Typography, } from "@mui/material";
import React from "react";
import DOMPurify from "dompurify";

type ILibraryQuestionModalProps = {
  open: boolean;
  handleClose: () => void;
  survey: any;
};

function LibraryQuestionModal({
  open,
  handleClose,
  survey,
}: ILibraryQuestionModalProps) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography mt={2} variant="h4">
            {survey?.title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Paper elevation={2} sx={{ pl: 2 }}>
              <Box
                p={2}
                component="div"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(survey?.description || ""),
                }}
              />
            </Paper>
            
            <Stack direction={"column"} gap={2} mt={4}>
              {survey?.Question?.map((q: any) => (
                <Paper elevation={2} sx={{ p: 2 }} key={q.question_text}>
                  {q.question_text}
                </Paper>
              ))}
              {!(survey?.Question?.length) &&<>
                <Typography width={"100%"} sx={{textAlign:'center'}} variant='subtitle1'>No Question Present in this survey!!</Typography>
              </>}
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LibraryQuestionModal;
