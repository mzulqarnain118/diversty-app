"use client";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { addGdpr, getGdprTemplate } from "@/services/gdpr.service";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import DOMPurify from "dompurify";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import * as Yup from "yup";

function Page({ params }: { params: { id: string } }) {
  const addGdprFn = useAsyncFn(addGdpr);
  const router = useRouter();

  const { data, loading } = useAsync(getGdprTemplate);

  const formik = useFormik({
    initialValues: {
      name: "",
      isAgree: false,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Name is required"),
      isAgree: Yup.boolean().oneOf([true], "Consent is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { name, isAgree } = values;
        const rgpd = await addGdprFn.execute({
          name,
          isAgree,
          respondentId: params.id,
        });
        router.push(`/user/response/${params.id}`);
      } catch (err: any) {
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err?.message ? err.message : err });
        helpers.setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Stack alignItems="center" justifyContent="center" height="100vh">
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Box
      component="main"
      maxWidth="md"
      width={"100%"}
      mx={"auto"}
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Paper elevation={2} sx={{ padding: 4 }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">
                {(data as any)?.gdprTemplate?.title || "Consent Form"}
              </Typography>
            </Stack>
            <Box px={{ md: 2, lg: 4 }} gap={4}>
              <Typography
                variant="subtitle1"
                p={2}
                component="div"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    (data as any)?.gdprTemplate?.description || ""
                  ),
                }}
              />
              <Box
                component="form"
                noValidate
                onSubmit={formik.handleSubmit}
                p={2}
                mt={4}
              >
                <Stack spacing={2}>
                  <FormControl
                    required
                    error={!!(formik.touched.isAgree && formik.errors.isAgree)}
                    component="fieldset"
                    sx={{ m: 3 }}
                    variant="standard"
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.isAgree}
                          name="isAgree"
                        />
                      }
                      label="Do you agree terms and conditions?"
                      onChange={formik.handleChange}
                    />
                    {formik.touched.isAgree && formik.errors.isAgree && (
                      <>
                        <FormHelperText>{formik.errors.isAgree}</FormHelperText>
                      </>
                    )}
                  </FormControl>
                  <TextField
                    id="name"
                    label="Name"
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ my: 2 }}
                  >
                    <Button variant="contained" type="submit">
                      Proceed
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default Page;
