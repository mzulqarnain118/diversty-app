"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";


function Page() {
  const router = useRouter();
  const { status } = useSession();
  const theme = useTheme();

  const passwordPattren =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/])(?!.*\s).{8,}$/;
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string()
        .max(255)
        .required("Password is required")
        .matches(
          passwordPattren,
          "Password is invalid. Please enter at least 8 characters, including numbers, different case letters, and special characters."
        ),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { email, password } = values;
        const res = await signIn("credentials", {
          email,
          password,
          redirect:false
        });

        if (res?.error) {
          toast.warn(res.error);
          throw new Error(res.error);
        }
        router.push("/");
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err?.message ? err.message : err });
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status]);

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
              <Typography variant="h4">Login</Typography>
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

            <Grid container justifyContent="center" mt={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth={true}
                  sx={{
                    fontSize: { md: "1rem", xs: "0.875rem" },
                    fontWeight: 500,
                    backgroundColor: theme.palette.grey[50],
                    color: theme.palette.grey[600],
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[100],
                    },
                  }}
                  size="large"
                  variant="contained"
                  onClick={()=> signIn('google', { callbackUrl: "/" })}
                >
                  <Box sx={{mr:{sm:'8px', md:'16px'}}} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <img
                    src={'/assets/images/social-google.svg'}
                    alt="google"
                    width="20px"
                  />
                  </Box>
                  {" "}
                  Sign in with Google
                </Button>
              </Grid>
            </Grid>

            <Box alignItems="center" display="flex" mt={2}>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
              <Typography
                color="textSecondary"
                variant="h5"
                sx={{ m: theme.spacing(2) }}
              >
                OR
              </Typography>
              <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            </Box>

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
              </Stack>
              <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
                <Typography color="text.secondary" variant="body2">
                  <Link
                    component={NextLink}
                    href="/auth/forgotPassword"
                    underline="hover"
                    variant="subtitle2"
                  >
                    Forgot Password
                  </Link>
                </Typography>
              </Box>
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
