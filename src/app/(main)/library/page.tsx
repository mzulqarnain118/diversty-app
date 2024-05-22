"use client";
import Search from "@/components/search";
import { CardViewType } from "@/components/sections/survey/survey-card";
import { useAsync } from "@/hooks/useAsync";
import { getLibrarySurveys } from "@/services/survey.service";
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Unstable_Grid2 as Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import LibrarySurveyCard from "@/components/sections/survey/library-survey-card";

function Page() {
  const { data, loading } = useAsync(getLibrarySurveys);
  const [view, setView] = React.useState<CardViewType>("TILE");
  console.log(data);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: CardViewType
  ) => {
    setView(nextView);
  };

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
          <Typography variant="h4">Library</Typography>
          <Card
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Search placeholder="Search Survey" />
            <Box>
              <ToggleButtonGroup value={view} exclusive onChange={handleChange}>
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

          {!loading && !(data as any)?.surveys?.length && (
            <>
              <Box display="flex" justifyContent="center" m={4} mt={8}>
                <Typography variant="h4">
                  No Survey Template Avaiable!!
                </Typography>
              </Box>
            </>
          )}

          <Grid container spacing={3}>
            {(data as any)?.surveys?.map((survey: any) => (
              <Grid
                {...(view === "CARD"
                  ? { xs: 12, md: 6, lg: 4 }
                  : { width: "100%" })}
                key={survey.id}
              >
                <LibrarySurveyCard varient={view} survey={survey} />
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
  );
}

export default Page;
