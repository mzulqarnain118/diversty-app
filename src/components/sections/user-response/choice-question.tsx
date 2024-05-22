"use client";
import { questionTypes } from "@/constants/questionTypes";
import { useAsyncFn } from "@/hooks/useAsync";
import { addResponses } from "@/services/response.service";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import SingleChoiceInput from "./single-choice-input";
import MultiChoiceInput from "./multi-choice-input";

function MultipleChoiceQuestion({
  id,
  question_text,
  choices = [],
  questionType,
  defaultResponse,
  onResponded,
}: any) {
  const updateResponseFn = useAsyncFn(addResponses);

  function handleUpdate(newValue: string) {
    updateResponseFn
      .execute(id, { type: questionType, answer: newValue })
      .then((res) => {
        onResponded(id);
      })
      .catch((err) => {
        toast.error(err?.msg || err.message);
      });
  }

  return (
    // <Paper
    //   elevation={3}
    //   key={id}
    //   sx={{
    //     width: "100%",
    //     border: "1px solid rgba(0,0,0,0.05)",
    //     p: 3,
    //   }}
    // >
    <FormControl sx={{ width: "100%" }}>
      {questionType === questionTypes.multiSelectMcq ? (
        <MultiChoiceInput
          {...{ choices, question_text, defaultResponse, handleUpdate }}
        />
      ) : (
        <SingleChoiceInput
          {...{ choices, question_text, defaultResponse, handleUpdate }}
        />
      )}
    </FormControl>
    // </Paper>
  );
}

export default MultipleChoiceQuestion;
