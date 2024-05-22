"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "react-toastify";
import { useAsyncFn } from "@/hooks/useAsync";
import { regenrateVerificationLink, verifyUser } from "@/services/user.service";
import { Alert, Box, Button, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

function Page() {
  const searchParams = useSearchParams();

  const token = searchParams.get("t");

  const { status, data } = useSession();
  const router = useRouter();

  const verifyUserFn = useAsyncFn(verifyUser);
  const regenrateFn = useAsyncFn(regenrateVerificationLink);

  useEffect(() => {
    if (status === "authenticated" && data.user.emailVerified) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[], status]);

  async function handleVerifyUser() {
    verifyUserFn
      .execute(token)
      .then((res: any) => {
        toast.success(res.msg);
        window.location.href = "/";
        window.location.assign("/");
      })
      .catch((err) => {});
  }

  async function handleRegenrate() {
    regenrateFn
      .execute(token)
      .then((res) => {
        toast.success("New Verification Link sent. Please check you email", {
          autoClose: false,
          closeOnClick: true,
        });
      })
      .catch((err) => {});
  }

  if (!token) {
    router.push("/auth/signup");
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Verify Email</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/signup"
                  underline="hover"
                  variant="subtitle2"
                >
                  Signup
                </Link>
              </Typography>
            </Stack>

            {!verifyUserFn.error && (
              <Stack spacing={3}>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  onClick={handleVerifyUser}
                >
                  Verify
                </Button>
              </Stack>
            )}

            {(verifyUserFn.error || regenrateFn.error) && (
              <Box my={4}>
                <Alert variant="outlined" severity="warning">
                  {verifyUserFn.error?.msg && !regenrateFn.error?.msg
                    ? verifyUserFn?.error?.msg
                    : regenrateFn?.error?.msg}
                </Alert>
              </Box>
            )}

            {verifyUserFn.error?.renew &&
              !regenrateFn.error &&
              !regenrateFn.data && (
                <Stack spacing={3}>
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    variant="contained"
                    onClick={handleRegenrate}
                  >
                    Regenrate
                  </Button>
                </Stack>
              )}
          </div>
        </Box>
      </Box>
    </>
  );
}

export default Page;
