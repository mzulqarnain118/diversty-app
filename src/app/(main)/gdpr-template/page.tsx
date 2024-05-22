"use client";

import Tiptap from "@/components/tiptap/Tiptap";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { createGdprTemplate, getGdprTemplate } from "@/services/gdpr.service";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ConsentCreatePage() {
  const [gdpr, setGdpr] = useState({ title: "", description: "" });

  const [isLoaded, setIsloaded] = useState(false)
  const { data: userSession } = useSession();

  const { data, loading } = useAsync(getGdprTemplate);

  const addGDPRFn = useAsyncFn(createGdprTemplate);
  const router = useRouter();

  function updateGDPRTemplate() {
    addGDPRFn
      .execute(gdpr)
      .then((res: any) => {
        toast.success(res?.msg);
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  }

  function handleOnChange(fieldName: string, value: string) {
    setGdpr((pre) => ({ ...pre, [fieldName]: value }));
  }

  useEffect(() => {
    if (userSession && userSession?.user.role !== "ADMIN") {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const { gdprTemplate } = data || ({} as any);
    if (gdprTemplate) {
      setGdpr(gdprTemplate);
    }
    if(data){
      setIsloaded(true)
    }
  }, [data]);

  if (loading || !isLoaded) {
    return (
      <Box width={"100%"} display={"flex"} justifyContent={"center"}>
        <CircularProgress />;
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Typography variant="h4">Create GDPR</Typography>
          </Stack>
          <Paper elevation={3} sx={{ p: { xs: 2, lg: 4 } }}>
            <TextField
              id="title"
              value={gdpr.title}
              onChange={(e) => handleOnChange("title", e.target.value)}
              fullWidth
              label="GDPR Title"
            />
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, lg: 4 },
                mt: 4,
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Tiptap
                content={gdpr.description}
                onChange={(val) => handleOnChange("description", val)}
              />
            </Paper>
            <Box
              sx={{
                my: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                disabled={addGDPRFn.loading}
                onClick={updateGDPRTemplate}
                type="button"
              >
                Update GDPR
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
