"use client";
import { useAsyncFn } from "@/hooks/useAsync";
import { addResponses } from "@/services/response.service";
import {
  FormControl,
  FormLabel,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

function OpenEndedQuestion({
  id,
  question_text,
  questionType,
  defaultResponse,
  onResponded,
}: any) {
  const [value, setValue] = useState(defaultResponse || "");
  const updateResponseFn = useAsyncFn(addResponses);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setValue(value);
    handleUpdate(value);
  };

  const handleUpdate = useCallback(
    _.debounce((newValue: string) => {
      const oldValue = value;
      updateResponseFn
        .execute(id, { type: questionType, answer: newValue })
        .then((res) => {
          onResponded(id);
        })
        .catch((err: any) => {
          setValue(oldValue);
          toast.error(err?.msg || err.message);
        });
    }, 1500),
    []
  );

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        border: "1px solid rgba(0,0,0,0.1)",
        p: 3,
        backgroundColor: "#EEF2FF",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <FormControl fullWidth>
        <FormLabel>
          <Typography
            variant="h6"
            sx={{ color: "#6366F1", fontWeight: "bold", mb: 1 }}
          >
            {question_text}
          </Typography>
        </FormLabel>
        <TextField
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#6366F1",
              },
              "&:hover fieldset": {
                borderColor: "#6366F1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366F1",
              },
            },
          }}
          id={id}
          multiline
          fullWidth
          rows={4}
          label="Response"
          value={value}
          onChange={handleChange}
        />
      </FormControl>
    </Paper>
  );
}

export default OpenEndedQuestion;
