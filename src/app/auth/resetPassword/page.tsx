"use client";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useAsyncFn } from "@/hooks/useAsync";
import { resetPassword } from "@/services/user.service";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import NextLink from "next/link";

function Page() {
  const searchParams = useSearchParams();

  const token = searchParams.get("t");

  const { status } = useSession();
  const router = useRouter();

  const resetPasswordFn = useAsyncFn(resetPassword);

  useEffect(() => {
    if (status === "authenticated") router.push("/patient");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[], status]);

  const passwordPattren =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/])(?!.*\s).{8,}$/;

  const formik = useFormik({
    initialValues: {
      password: "",
      password1: "",
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password is required")
        .matches(
          passwordPattren,
          "Password is invalid. Please enter at least 8 characters, including numbers, different case letters, and special characters."
        ),
      password1: Yup.string()
        .required("Retype Password is required")
        .oneOf([Yup.ref("password")], "Password not matched"),
    }),
    onSubmit: async (values, helpers) => {
      const { password } = values;
      try {
        if (!token) throw new Error("You Cant proceed!, Please use valid link");
        const { success = null, msg =null} = (await resetPasswordFn.execute(
          password,
          token
        )) as any;
        if (success) {
          toast.success(msg);
          return;
        }
        throw new Error(msg);
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err?.message ? err.message : err });
        helpers.setSubmitting(false);
      }
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
              <Typography variant="h4">Set New Password</Typography>
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
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={
                    !!(formik.touched.password1 && formik.errors.password1)
                  }
                  fullWidth
                  helperText={
                    formik.touched.password1 && formik.errors.password1
                  }
                  label="Retype Password"
                  name="password1"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password1}
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
