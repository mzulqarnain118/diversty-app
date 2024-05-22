"use client";
import { Alert, Box, Button, Collapse, IconButton } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";
import { useAsyncFn } from "@/hooks/useAsync";
import { regenrateVerificationLink } from "@/services/user.service";
import { toast } from "react-toastify";
function EmailVerificationWarning() {
  const [open, setOpen] = React.useState(true);
  const { data, status } = useSession();
  const [linkSent, setLinkSent] = useState(false);

  const regenrateFn = useAsyncFn(regenrateVerificationLink);

  if (status === "authenticated" && data.user.emailVerified) {
    return null;
  }

  async function handleRegenrate() {
    regenrateFn
      .execute()
      .then((res) => {
        toast.success("Link Sent successfully", {
          autoClose: false,
          closeOnClick: true,
        });
        setLinkSent(true);

        // setTimeout(() => {
        //   setOpen(false);
        // }, 10000);
      })
      .catch((err) => {
        toast.error(err?.msg || err?.message || "Something went wrong!");
      });
  }

  return (
    <Box sx={{ width: "100%", px: 2 }}>
      <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {!linkSent ? (
            <>
              Your email is not verified, Please Verify your email to get full
              access{" "}
              <Button sx={{ py: 0 }} onClick={handleRegenrate}>
                Verify Now
              </Button>
            </>
          ) : (
            <>Verification Link send, Please check your email</>
          )}
        </Alert>
      </Collapse>
    </Box>
  );
}

export default EmailVerificationWarning;
