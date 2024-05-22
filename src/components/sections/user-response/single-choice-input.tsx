import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const SingleChoiceInput = ({
  choices,
  defaultResponse,
  question_text,
  handleUpdate,
}: any) => {
  console.log("🚀 ~ choices:", choices);

  const [value, setValue] = useState(defaultResponse);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    handleUpdate(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#EEF2FF",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "800px",
        margin: "20px auto",
        alignSelf: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: "20px", color: "#333", textAlign: "center" }}
      >
        {question_text}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {choices?.[0]?.choice_text == "1" && (
          <p style={{ color: "#6366F1" }}>Totally Disagree</p>
        )}
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          row
          onChange={handleChange}
        >
          {choices.map((choice: any) => (
            <FormControlLabel
              key={choice.id}
              value={choice.id}
              control={
                <Radio
                  sx={{
                    color: "#6366F1",
                    "&.Mui-checked": {
                      color: "#6366F1",
                    },
                  }}
                />
              }
              label={choice.choice_text}
              sx={{
                marginRight: "10px",
                "&:hover": {
                  backgroundColor: "#E0E7FF",
                },
                borderRadius: "4px",
                padding: "5px",
              }}
            />
          ))}
        </RadioGroup>
        {choices?.[0]?.choice_text == "1" && (
          <p style={{ color: "#6366F1" }}>Totally Agree</p>
        )}
      </Box>
    </Box>
  );
};

export default SingleChoiceInput;
