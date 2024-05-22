"use client";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { createSurvey, getSurveys } from "@/services/survey.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CircularProgress,
} from "@mui/material";
import SurveyCard, {
  CardViewType,
} from "@/components/sections/survey/survey-card";
import SurveySearch from "@/components/search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

function Page() {
  const { data = [], loading } = useAsync(getSurveys);
  const [survey, setSurvey] = useState<any[]>([]);
  const createSurvayFn = useAsyncFn(createSurvey);
  const router = useRouter();

  useEffect(() => {
    if ((data as any)?.surveys) {
      setSurvey((data as any).surveys);
    }
  }, [data]);

  const [view, setView] = React.useState<CardViewType>("TILE");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: CardViewType
  ) => {
    setView(nextView);
  };

  function handleCreateSurvey() {
    const data = { name: "Untitled Title", description: "<p><br></p>" };
    createSurvayFn
      .execute(data)
      .then((res: any) => {
        console.log(res);
        toast.success(res?.msg);
        router.push(`/survey/edit/${res.survey.id}`);
      })
      .catch((err) => {
        toast.error(err.msg || "Something went wrong");
      });
  }

  function handelDeleteSurvey(id: string) {
    setSurvey((old) => old.filter((s) => s.id !== id));
  }

  function handleDuplicate(survey: any) {
    setSurvey((pre) => [...pre, survey]);
  }

  return (
    <>
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
              <Typography variant="h4">My Surveys</Typography>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleCreateSurvey}
                  disabled={createSurvayFn.loading}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <Card
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <SurveySearch placeholder="Search Placeholder" />
              <Box>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton value="TILE" aria-label="TILE">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="CARD" aria-label="CARD">
                    <ViewModuleIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Card>
            {loading && (
              <Box display="flex" justifyContent="center" m={4} mt={8}>
                <CircularProgress />
              </Box>
            )}

            {!loading && !survey.length && (
              <>
                <Box display="flex" justifyContent="center" m={4} mt={8}>
                  <Typography variant="h4">No Survey Avaiable!!</Typography>
                </Box>
              </>
            )}
            <Grid container spacing={3}>
              {survey.map((survey: any) => (
                <Grid
                  {...(view === "CARD"
                    ? { xs: 12, md: 6, lg: 4 }
                    : { width: "100%" })}
                  key={survey.id}
                >
                  <SurveyCard
                    varient={view}
                    survey={survey}
                    onDelete={handelDeleteSurvey}
                    onDuplicate={handleDuplicate}
                  />
                </Grid>
              ))}
            </Grid>
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination count={3} size="small" />
            </Box> */}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
