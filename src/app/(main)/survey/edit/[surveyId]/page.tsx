"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useAsync, useAsyncFn } from "@/hooks/useAsync";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getSurveyAndQuestionnaireWithSections,
  updateSequence as updateSequenceService,
  updateSuurvey,
} from "@/services/survey.service";
import _ from "lodash";
import { createQuestion } from "@/services/question.service";
import { questionTypes } from "@/constants/questionTypes";
import QuestionItem from "@/components/QuestionItem";
import SectionItem from "@/components/SectionItem";
import CloseEndedChoiceTypeProvider from "@/contexts/CloseEndedChoiceTypeContext";
import Tiptap from "@/components/tiptap/Tiptap";
import ImportQuestion from "@/components/import-question/ImportQuestion";
import { createSection } from "@/services/section.services";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToWindowEdges,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Paper,
  SvgIcon,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { IQuestion, ISection, ISurvey } from "@/types";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TagListProvider from "@/contexts/TagListProvider";

function Page({ params }: { params: { surveyId: string } }) {
  const { data, loading, error } = useAsync(() =>
    getSurveyAndQuestionnaireWithSections(params.surveyId)
  );

  const [importIdx, setImportIdx] = useState(-1);
  const [showMessage, setShowMessage] = useState(false);

  const updateSurveyFn = useAsyncFn(updateSuurvey);
  const addQuestionFn = useAsyncFn(createQuestion);
  const addSectionFn = useAsyncFn(createSection);
  const updateSequenceFn = useAsyncFn(updateSequenceService);

  const _loading =
    addQuestionFn.loading || updateSequenceFn.loading || addSectionFn.loading;

  const router = useRouter();

  const [questions, setQuestions] = useState<(IQuestion | ISection)[]>([]);
  const [survey, setSurvey] = useState<ISurvey[]>([]);

  useEffect(() => {
    if (!data) return;

    const { survey, questionAndSection } = data as any;

    let surveyCount = 1;
    let questionCount = 1;
    setSurvey([survey]);

    const questionTotal =
      questionAndSection?.filter((q: any) => q.type === "QUESTION")?.length ||
      0;
    const sectionTotal =
      questionAndSection?.filter((q: any) => q.type !== "QUESTION")?.length ||
      0;

    const questionWithPositions = questionAndSection?.map(
      (q: any, idx: number) => {
        const position =
          q.type === "QUESTION" ? questionCount++ : surveyCount++;

        const total = q.type === "QUESTION" ? questionTotal : sectionTotal;
        return { ...q, position, total };
      }
    );
    setQuestions(questionWithPositions);
  }, [data]);

  const handleChange = _.debounce(
    (name: string, value: string) => handleUpdateSurvey(name, value),
    500
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const activeIndex = questions.findIndex((item) => item.id === active.id);
    const overIndex = questions.findIndex((item) => item.id === over.id);

    handleSequenceChange(undefined, activeIndex, overIndex);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowMessage(false);
  };

  async function handleUpdateSurvey(name: string, value: string) {
    let data = { [name]: value };

    try {
      await updateSurveyFn.execute(params.surveyId, data);
      setShowMessage(true);
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  function addQuestion(orderNumber: number) {
    addQuestionFn
      .execute({
        question_text: "Untitled",
        question_type: questionTypes.openEnded,
        survey_id: params.surveyId,
        orderNumber: questions.length,
      })
      .then((res: any) => {
        toast.success("Question added successfully!");
        handleAddItem({ ...res?.question, type: "QUESTION" }, orderNumber);
      })
      .catch((err) => {
        toast.error("Failed to add Question!");
      });
  }

  function addSection(orderNumber: number) {
    addSectionFn
      .execute({
        title: "",
        description: "",
        survey_id: params.surveyId,
        orderNumber: questions.length,
      })
      .then((res: any) => {
        toast.success("Section added successfully!");
        handleAddItem({ ...res?.section, type: "SECTION" }, orderNumber);
      })
      .catch((err) => {
        toast.error("Failed to add Section!");
      });
  }

  function addItemRequest(
    type: "QUESTION" | "SECTION",
    order: number,
    position: "ABOVE" | "BELOW"
  ) {
    if (_loading) return;

    if (position === "ABOVE") {
      order = order === 0 ? 0 : order - 1;
    } else {
      order += 1;
    }
    console.log("Add: ", type, ", at: ", order, "=>", position);
    if (type === "QUESTION") {
      addQuestion(order);
    } else if (type === "SECTION") {
      addSection(order);
    }
  }

  function importRequest(position: "ABOVE" | "BELOW", orderNumber: number) {
    if (_loading) return;
    if (position === "ABOVE") {
      orderNumber = orderNumber === 0 ? 0 : orderNumber - 1;
    } else {
      orderNumber += 1;
    }

    setImportIdx(orderNumber);
  }

  function updateSequence(newSequence: any, oldQuestions: any) {
    updateSequenceFn
      .execute({ newSequence })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err) => {
        toast.error("Failed to update sequence!");
        setQuestions(oldQuestions);
        // TODO Reload page
      });
  }

  function handleAddItem(item: IQuestion | ISection, orderNumber: number) {
    const _questions = [...questions];
    _questions.push(item);
    handleSequenceChange(_questions, _questions.length - 1, orderNumber);
  }

  function handleMove(direction: "UP" | "DOWN", orderNumber: number) {
    if (direction === "UP" && orderNumber === 0) return;
    if (direction === "DOWN" && orderNumber === questions.length - 1) return;

    handleSequenceChange(
      undefined,
      orderNumber,
      direction === "UP" ? orderNumber - 1 : orderNumber + 1
    );
  }

  function handleSequenceChange(
    _questions = questions,
    from: number,
    to: number
  ) {
    const newQuestions =
      from === to ? _questions : arrayMove(_questions, from, to);

    const newSequence = newQuestions.map((item, index) => {
      return { id: item.id, type: item.type, orderNumber: index + 1 };
    });

    const oldQuestions = [..._questions];

    setQuestions(newQuestions);

    updateSequence(newSequence, oldQuestions);
  }

  function onDescriptionChange(value: string) {
    handleChange("description", value);
  }

  function onImportQuestion(q: IQuestion) {
    handleAddItem({ ...q, type: "QUESTION" }, importIdx);
    setImportIdx(-1);
  }

  function handleDelete(id: number) {
    const removedIdx = questions.findIndex((q) => q.id == id);

    const newQuestionLis = questions.filter((q) => q.id != id);

    // just update order in db
    handleSequenceChange(newQuestionLis, 0, 0);
  }

  function handleRespondents() {
    router.push(`/survey/respondents/${params.surveyId}`);
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              <Typography variant="h4">Survey</Typography>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  disabled={questions?.length < 1}
                  onClick={handleRespondents}
                >
                  Add Respondents
                </Button>
              </div>
            </Stack>

            <Paper elevation={3} sx={{ p: { xs: 2, lg: 4 } }}>
              <TextField
                id="name"
                defaultValue={(data as any)?.survey?.title}
                onChange={(e) => handleChange("title", e.target.value)}
                fullWidth
                label="Title"
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
                  content={(data as any)?.survey?.description}
                  onChange={onDescriptionChange}
                />
              </Paper>
              {updateSurveyFn.loading && (
                <Box
                  sx={{
                    my: 1,
                    display: "flex",
                    justifyContent: "end",
                    color: "rgba(0,0,0,0.5)",
                  }}
                >
                  Saving...
                </Box>
              )}
            </Paper>

            <Stack spacing={4} p={{ xs: 0, md: 2 }} alignItems={"center"}>
              <CloseEndedChoiceTypeProvider>
                <TagListProvider>
                  <DndContext
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                  >
                    <SortableContext
                      items={questions}
                      strategy={verticalListSortingStrategy}
                    >
                      {/* <DragOverlay
                        modifiers={[
                          restrictToVerticalAxis,
                          restrictToWindowEdges,
                        ]}
                      > */}
                      {questions.map((item, idx) => {
                        if (item.type == "QUESTION") {
                          const questionItem = item as IQuestion;
                          return (
                            <QuestionItem
                              key={item.id}
                              question={questionItem}
                              idx={idx}
                              onDelete={handleDelete}
                              addItem={addItemRequest}
                              handleMove={handleMove}
                              loading={_loading}
                              handleImport={importRequest}
                              setList={setQuestions}
                            />
                          );
                        } else {
                          const sectionItem = item as ISection;
                          return (
                            <SectionItem
                              key={item.id}
                              section={sectionItem}
                              onDelete={handleDelete}
                              idx={idx}
                              addItem={addItemRequest}
                              handleMove={handleMove}
                              handleImport={importRequest}
                              loading={_loading}
                              setList={setQuestions}
                            />
                          );
                        }
                      })}
                      {/* </DragOverlay> */}
                    </SortableContext>
                  </DndContext>
                </TagListProvider>
              </CloseEndedChoiceTypeProvider>
            </Stack>
            <ImportQuestion
              surveyId={params.surveyId}
              onImportQuestion={onImportQuestion}
              importIdx={importIdx}
              setImportIdx={setImportIdx}
            />
            {!!(!error && !loading && !questions.length) && (
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
                  disabled={addQuestionFn.loading || addSectionFn.loading}
                  onClick={() => setImportIdx(0)}
                >
                  Import Question
                </Button>
                <Button
                  variant="contained"
                  disabled={addQuestionFn.loading || addSectionFn.loading}
                  onClick={() => addQuestion(0)}
                >
                  Add question
                </Button>
                <Button
                  variant="contained"
                  disabled={addQuestionFn.loading || addSectionFn.loading}
                  onClick={() => addSection(0)}
                >
                  Add Section
                </Button>
              </Box>
            )}
          </Stack>
        </Container>
        <Snackbar
          open={showMessage}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Changes Saved"
        />
      </Box>
    </>
  );
}

export default Page;
