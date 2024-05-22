"use client";
import { useAsync } from "@/hooks/useAsync";
import { getResponses } from "@/services/response.service";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MultipleChoiceResponse from "@/components/question-response/MultipleChoiceResponse";
import { questionTypes } from "@/constants/questionTypes";
import OpenEndedResponse from "@/components/question-response/OpenEndedResponse";
import CloseEndedResponse from "@/components/question-response/CloseEndedResponse";

import { Box, Container, Stack, Typography } from "@mui/material";

function Page({ params }: { params: { surveyId: string } }) {
  const { loading, data } = useAsync(() => getResponses(params.surveyId));
  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
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
              <Typography variant="h4">Responses</Typography>
            </Stack>
            <Box>
              {!loading && ((data as any)?.responses?.length) ? (
                <>
                  {(data as any)?.responses?.map((q: any) => {
                    switch (q.question_type) {
                      case questionTypes.mcqs:
                      case questionTypes.multiSelectMcq:
                        return (
                          <MultipleChoiceResponse
                            questionText={q.question_text}
                            options={q.options}
                            key={q.id}
                          />
                        );
                      case questionTypes.openEnded:
                        return (
                          <OpenEndedResponse
                            questionText={q.question_text}
                            options={q.options}
                            key={q.id}
                          />
                        );
                      case questionTypes.closeEnded:
                        return (
                          <CloseEndedResponse
                            questionText={q.question_text}
                            options={q.options}
                            key={q.id}
                          />
                        );
                    }
                  })}
                </>
              ) : (
                <Box display={"flex"} justifyContent={"center"} my={4}>
                  <Typography variant="h6">
                    Ooooops, No One responded yet !!
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Page;
