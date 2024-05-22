import { questionTypes } from "@/constants/questionTypes";
import React from "react";
import OpenEndedQuestion from "../sections/user-response/open-ended-question";
import MultipleChoiceQuestion from "../sections/user-response/choice-question";
import { Box } from "@mui/material";

const SubmitQuestionItem = ({
  id,
  question_text,
  question_type: questionType,
  choices,
  defaultResponse,
  onResponded,
}: any) => {
  return (
    <Box key={id}>
      {questionType === questionTypes.openEnded ? (
        <OpenEndedQuestion
          key={id}
          {...{
            id,
            question_text,
            questionType,
            defaultResponse,
            onResponded,
          }}
        />
      ) : (
        <MultipleChoiceQuestion
          key={id}
          {...{
            id,
            question_text,
            questionType,
            choices,
            defaultResponse,
            onResponded,
          }}
        />
      )}
    </Box>
  );
};

export default SubmitQuestionItem;
