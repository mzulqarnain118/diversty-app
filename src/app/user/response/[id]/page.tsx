"use client";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { getQuestionsByServey } from "@/services/question.service";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DOMPurify from "dompurify";
import {
  Alert,
  Button,
  Collapse,
  Paper,
  IconButton,
  Slide,
  LinearProgress,
  Avatar,
  CardContent,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
import { submitResponses } from "@/services/response.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SubmitQuestionItem from "@/components/submit-question/question-submit-item";
import SectionSubmitItem from "@/components/submit-question/section-submit-ite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HelpIcon from "@mui/icons-material/Help";
import NextLink from "next/link";
import Logo from "@/components/logo";
import { IQuestion, ISection } from "@/types";
function Page({ params }: { params: { id: string } }) {
  const { data, loading, error } = useAsync(() =>
    getQuestionsByServey(params.id)
  );
  console.log("🚀 ~ Page ~ data:", data);
  const submitFn = useAsyncFn(submitResponses);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);

  const [currentView, setCurrentView] = useState<"main" | "questions">("main");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());

  const [questionCountMap, setQuestionCountMap] = useState(new Map());

  useEffect(() => {
    if (error && error.redirect) {
      router.push(`/user/consent/${params.id}`);
    }
  }, [error]);

  const questions = React.useMemo(() => {
    if (data) {
      setIsLoaded(true);
    }
    setIsSubmitted((data as any)?.isSubmitted);

    const list = (data as any)?.questions || ([] as (IQuestion | ISection)[]);
    let counter = 0,
      _idx = 0;
    const _newOrderMap = new Map();
    const _newSubmitted = new Set();
    for (let q of list) {
      const { id, type, defaultResponse } = q;
      if (type === "QUESTION") {
        if (!!defaultResponse) {
          _newSubmitted.add(id);
        }
        _newOrderMap.set(_idx, ++counter);
      }
      _idx++;
    }

    if (_newOrderMap.size) {
      setCurrentQuestion(1);
    }
    const _progress = _newOrderMap.size
      ? (_newSubmitted.size / _newOrderMap.size) * 100
      : 0;
    setProgress(_progress);
    setQuestionCountMap(_newOrderMap);
    setSubmittedQuestions(_newSubmitted);
    return list;
  }, [data]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      updateProgres(newIndex);
    }
  };
  function onRespond(id: string) {
    setSubmittedQuestions((pre) => {
      const temp = new Set(pre.values());
      temp.add(id);
      return temp;
    });
  }

  useEffect(() => {
    const _progress = questionCountMap.size
      ? (submittedQuestions.size / questionCountMap.size) * 100
      : 0;
    setProgress(_progress);
  }, [submittedQuestions]);

  function updateProgres(idx: number) {
    setCurrentQuestionIndex(idx);

    const _currentQuestion = questionCountMap.get(idx);
    if (_currentQuestion) {
      setCurrentQuestion(_currentQuestion);
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      updateProgres(newIndex);
    }
  };

  function submitSurvey() {
    submitFn
      .execute(params.id)
      .then((res: any) => {
        const { isSubmitted } = res;
        setIsSubmitted(isSubmitted);
        toast.success("Response submitted successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.msg || err.message);
        const { unanswered } = err;
        if (unanswered?.length) {
          const doc = document.getElementById(`${unanswered[0]}`);
          doc?.scrollIntoView();
          doc?.focus();
        }
      });
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!(data as any)?.survey && isLoaded) {
    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        maxWidth={"lg"}
        width={"100%"}
        mx={"auto"}
        my={4}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Invalid Invitation Link.
        </Typography>
      </Box>
    );
  }
  return (
    <>
      {currentView === "questions" && (
        <AppBar
          position="static"
          sx={{ backgroundColor: "white", color: "black" }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                component={NextLink}
                href="/"
                sx={{
                  display: "inline-flex",
                  height: 16,
                  width: { md: "60%", sm: "40%", xs: "30%" },
                }}
              >
                <Logo />
              </Box>
              <Typography variant="h8">
                <strong>
                  Question {currentQuestion} of {questionCountMap?.size}
                </strong>
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ width: "100%", mr: 1 }}>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${Math.round(progress)}%`}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Help Me" sx={{ backgroundColor: "inherit" }}>
                  <IconButton sx={{ p: 0 }}>
                    <Avatar>
                      <HelpIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
      <Box
        component="main"
        maxWidth="md"
        width={"100%"}
        mx={"auto"}
        sx={{
          flexGrow: 1,
          py: 8,
          ...(isSubmitted && { pointerEvents: "none" }),
        }}
      >
        <Container maxWidth="xl">
          {currentView === "questions" && isSubmitted && (
            <Collapse in={true}>
              <Alert sx={{ mb: 2 }}>Response is Submitted!!</Alert>
            </Collapse>
          )}
          {currentView === "main" ? (
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Typography variant="h4">
                  {(data as any)?.survey?.title}
                </Typography>
              </Stack>
              <Box px={{ md: 2, lg: 4 }} gap={4}>
                <Paper elevation={5} sx={{ p: 4 }}>
                  <Box
                    component="div"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        (data as any)?.survey?.description || ""
                      ),
                    }}
                  />
                </Paper>
                <Stack
                  spacing={2}
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ my: 2 }}
                >
                  <Button
                    variant="contained"
                    type="button"
                    onClick={() => setCurrentView("questions")}
                  >
                    Proceed to Q/A
                  </Button>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <>
              <Box>
                <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                  <Box>
                    <Typography variant="h5">Add response below</Typography>
                    <Stack spacing={4} sx={{ p: 2, pr: 0 }}>
                      {questions[currentQuestionIndex].type === "QUESTION" ? (
                        <SubmitQuestionItem
                          key={questions[currentQuestionIndex].id}
                          onResponded={onRespond}
                          {...questions[currentQuestionIndex]}
                        />
                      ) : (
                        <SectionSubmitItem
                          key={questions[currentQuestionIndex].id}
                          onResponded={onRespond}
                          {...questions[currentQuestionIndex]}
                        />
                      )}
                    </Stack>
                    {currentQuestionIndex === questions.length - 1 && (
                      <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ my: 2 }}
                      >
                        <Button
                          variant="contained"
                          type="button"
                          onClick={submitSurvey}
                          disabled={submitFn.loading || isSubmitted}
                        >
                          {isSubmitted ? "Submitted" : "Submit"}
                        </Button>
                      </Stack>
                    )}
                    <Stack
                      spacing={2}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ my: 2, marginTop: "30%" }}
                    >
                      <IconButton
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </Slide>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export default Page;
