"use client";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAsyncFn } from "@/hooks/useAsync";
import { forgotPassword } from "@/services/user.service";
import NextLink from "next/link";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";

function Page() {
  const { status } = useSession();
  const router = useRouter();

  const forgotPasswordFn = useAsyncFn(forgotPassword);

  useEffect(() => {
    if (status === "authenticated") router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[], status]);

  const formik = useFormik({
    initialValues: {
      email: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email").required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      const { email } = values;
      forgotPasswordFn
        .execute(email)
        .then((res: any) => {
          const { success } = res;
          if (success) {
            toast.success("Please check your Email and proceed");
            return;
          }
          toast.warning(res?.msg);
          throw new Error(res?.msg);
        })
        .catch((err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err?.message ? err.message : err });
          helpers.setSubmitting(false);
        });
    },
  });

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
              <Typography variant="h4">Forgot Password</Typography>
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
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={forgotPasswordFn.loading}
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default Page;
