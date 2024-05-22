"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { questionTypes, questionTypesList } from "@/constants/questionTypes";
import { useCloseEndedChoiceType } from "@/contexts/CloseEndedChoiceTypeContext";
import { useAsyncFn } from "@/hooks/useAsync";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  deleteQuestion,
  updateQuestion,
  updateTags,
} from "@/services/question.service";
import _ from "lodash";
import QuestionOptions from "./QuestionOptions";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete, Button, Checkbox, Paper, Snackbar } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { IQuestion, ISection, ITag } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useTagList } from "@/contexts/TagListProvider";
import AddSurveyItemDial from "./add-survey-item-dial";
import ImportQuestionDial from "./import-question-dial";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

interface IQuestionItemProps {
  question: IQuestion;
  onDelete: (id: number) => void;
  idx: number;
  addItem: (
    type: "QUESTION" | "SECTION",
    order: number,
    position: "ABOVE" | "BELOW"
  ) => void;
  handleMove: (direction: "UP" | "DOWN", orderNumber: number) => void;
  loading: boolean;
  handleImport: (position: "ABOVE" | "BELOW", orderNumber: number) => void;
  setList: React.Dispatch<React.SetStateAction<(IQuestion | ISection)[]>>;
}

function QuestionItem({
  question,
  onDelete,
  idx,
  addItem,
  handleMove,
  loading,
  handleImport,
  setList,
}: IQuestionItemProps) {
  const { attributes, listeners, transform, setNodeRef, transition } =
    useSortable({ id: question.id });

  const {
    tags: tagList,
    search,
    setSearch: _setSearch,
  } = useTagList() as {
    tags: ITag[];
    search: string;
    setSearch: (val: string) => void;
  };

  const { variants, loading: variantLoading } =
    useCloseEndedChoiceType() as any;
  const [selectedType, setSelectedType] = useState<string | undefined>(
    question.question_type
  );
  const [questionText, setQuestionText] = useState<string | undefined>(
    question.question_text
  );
  const [varient, setVarient] = useState<string | undefined>(
    question.closeEndedChoiceType_id || ""
  );
  const [choices, setChoices] = useState(question.Choice);

  const [favourite, setFavourite] = useState(question.isTemplate);

  const [tags, setTags] = useState<any[]>(question.tags);

  const updateQuestionFn = useAsyncFn(updateQuestion);
  const deleteQuestionFn = useAsyncFn(deleteQuestion);
  const updateTagFn = useAsyncFn(updateTags);

  const [showMessage, setShowMessage] = useState(false);

  const updateList = (q: IQuestion) => {
    setList((pre) => {
      const old = pre;
      old[idx] = { ...q, type: "QUESTION" };

      return [...old];
    });
  };

  useEffect(()=>{
    updateList({...question, Choice: choices})
  }, [choices])

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowMessage(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateDebounce = React.useCallback(
    _.debounce(
      (field_name: string, value: string) =>
        updateQuestionFn
          .execute(question.id, { field_name, value })
          .then((res:any) => {setShowMessage(true), updateList(res.question)})
          .catch(console.log),
      1000
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id]
  );
  const setSearch = React.useCallback(
    _.debounce(_setSearch, 800),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id]
  );

  function handleQuestionTextChange(value: string) {
    setQuestionText(value);
    handleUpdateDebounce("question_text", value);
  }

  async function handleTypeChange(value: string) {
    const oldType = selectedType;
    setSelectedType(value);
    try {
      const q = await updateQuestionFn.execute(question.id, {
        field_name: "question_type",
        value: value,
      });
      setSelectedType((q as any)?.question.question_type);
      setVarient((q as any)?.question.closeEndedChoiceType_id);
      setShowMessage(true);
      updateList((q as any).question)
      if (oldType === questionTypes.mcqs) setChoices([]);
    } catch (e) {
      setSelectedType(oldType);
    }
  }

  async function handleVarientChange(value: string) {
    if (!value) return;
    const oldVarient = varient;
    setVarient(value);
    try {
      const q = await updateQuestionFn.execute(question.id, {
        field_name: "question_varient",
        value: value,
      });
      updateList((q as any).question)
      setShowMessage(true);
    } catch (e) {
      setVarient(oldVarient);
    }
  }

  const handleFavouriteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.checked;
    const oldFavourite = favourite;
    setFavourite(value);
    updateQuestionFn
      .execute(question.id, {
        field_name: "visiblity",
        value: value,
      })
      .then((res:any) => {
        setShowMessage(true);
        updateList(res.question)
      })
      .catch((err) => {
        setFavourite(oldFavourite);
      });
  };

  function handleDelete() {
    deleteQuestionFn
      .execute(question.id)
      .then((res) => {
        onDelete(question.id);
      })
      .catch((err) => {
        toast.error(err?.msg || "Something went wrong!");
      });
  }

  function updateTaglist(tagList: ITag[]) {
    const tags = tagList.map((t) => t.id);

    updateTagFn
      .execute(question.id, { tags })
      .then((res) => {
        setShowMessage(true)
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (variantLoading) {
    return null;
  }

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <Box
      ref={setNodeRef}
      style={style}
      maxWidth={"lg"}
      width={"100%"}
      sx={{
        "& .MuiInput-root:before": {
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          {/* text */}
          <TextField
            id="outlined-basic"
            multiline
            fullWidth
            label={
              <>
                <strong>{question.position} / {question.total}</strong>. Question
              </>
            }
            value={questionText}
            rows={2}
            variant="standard"
            onChange={(e) => handleQuestionTextChange(e.target.value)}
          />
          {/* tags */}
          <Autocomplete
            multiple
            fullWidth
            limitTags={2}
            id="multiple-limit-tags"
            options={tagList}
            getOptionLabel={(option: ITag) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            defaultValue={tags}
            value={tags}
            onChange={(e, _tags) => {
              updateTaglist(_tags);
              setTags(_tags);
            }}
            // onInputChange={(e, n) => setSearch(n)}
            renderInput={(params) => (
              <TextField {...params} label="Tags" variant="standard" />
            )}
          />
          {/* Question type */}
          <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
            <FormControl sx={{ minWidth: 280, flex: 1 }} variant="standard">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-select"
                id="type-select"
                label="Type"
                defaultValue={selectedType}
                value={selectedType}
                variant="standard"
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                {questionTypesList.map((q) => (
                  <MenuItem key={q.label} value={q.value}>
                    {q.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {questionTypes.closeEnded === selectedType && (
              <FormControl sx={{ minWidth: 280, flex: 1 }} variant="standard">
                <InputLabel id="demo-simple-select-label">Variant</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Type"
                  defaultValue={varient}
                  value={varient}
                  onChange={(e) => handleVarientChange(e.target.value)}
                >
                  <MenuItem value={""}>Choose Variant</MenuItem>
                  {variants?.map((q: any) => (
                    <MenuItem key={q.id} value={q.id}>
                      {q.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
          {/* MCQ options */}
          {[questionTypes.mcqs, questionTypes.multiSelectMcq].includes(
            selectedType || ""
          ) && (
            <Box sx={{ pl: { sm: 0, md: 4 } }}>
              <QuestionOptions
                questionId={question.id}
                choices={choices}
                setChoices={setChoices}
              />
            </Box>
          )}
          {/*tool bar */}
          <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems={"center"}
            flexWrap={"wrap"}
          >
            <Box />
            <Stack direction={"row"} spacing={1}>
              <Box width={30}>
                <CircularProgress size="small" />
                {(updateQuestionFn.loading || deleteQuestionFn.loading) && (
                  <div></div>
                )}
              </Box>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={handleDelete}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <Box>
                <Checkbox
                  size="small"
                  checked={favourite}
                  onChange={handleFavouriteChange}
                  {...{ inputProps: { "aria-label": "Favourite checkbox" } }}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                />
              </Box>
              <IconButton
                aria-label="move up"
                disabled={loading}
                size="small"
                onClick={() => handleMove("UP", idx)}
              >
                <KeyboardDoubleArrowUpIcon fontSize="small" />
              </IconButton>
              <IconButton
                disabled={loading}
                aria-label="move down"
                size="small"
                onClick={() => handleMove("DOWN", idx)}
              >
                <KeyboardDoubleArrowDownIcon fontSize="small" />
              </IconButton>
              <IconButton
                disabled={loading}
                aria-label="drag"
                size="small"
                {...attributes}
                {...listeners}
              >
                <DragIndicator fontSize="small" />
              </IconButton>
            </Stack>
            <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
              <ImportQuestionDial
                currentPosition={idx}
                handleImport={handleImport}
              />
              <AddSurveyItemDial currentPosition={idx} addItem={addItem} />
            </Stack>
          </Box>
        </Stack>
        <Snackbar
          open={showMessage}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Changes Saved"
        />
      </Paper>
    </Box>
  );
}

export default QuestionItem;
