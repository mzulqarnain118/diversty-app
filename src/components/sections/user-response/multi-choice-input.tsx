import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const MultiChoiceInput = ({
  choices,
  defaultResponse,
  question_text,
  handleUpdate,
}: any) => {
  const [value, setValue] = useState<any[]>(defaultResponse);

  function onSelect(id: number) {
    setValue((pre) => [...pre, id]);
  }

  function onDeselect(id: number) {
    setValue((pre) => pre.filter((_id) => _id != id));
  }

  useEffect(() => {
    handleUpdate(value);
  }, [value]);

  return (
    <Box
      sx={{
        backgroundColor: "#f0f4f8",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "800px",
        margin: "20px auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: "20px", color: "#333", textAlign: "center" }}
      >
        {question_text}
      </Typography>
      <FormGroup>
        {choices.map((choice: any) => {
          const isChecked = value.includes(choice.id);
          return (
            <FormControlLabel
              key={choice.id}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelect(choice.id);
                    } else {
                      onDeselect(choice.id);
                    }
                  }}
                  name={`choice-${choice.id}`}
                  sx={{
                    color: "primary",
                    "&.Mui-checked": {
                      color: "primary",
                    },
                  }}
                />
              }
              label={choice.choice_text}
              sx={{
                marginBottom: "10px",
                "&:hover": {
                  backgroundColor: "#E0E7FF",
                },
                borderRadius: "4px",
                padding: "5px",
              }}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
};

export default MultiChoiceInput;
