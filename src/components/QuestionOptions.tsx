import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAsyncFn } from "@/hooks/useAsync";
import { addChoice } from "@/services/choice.service";
import QuestionsOptionField from "./QuestionsOptionField";
import { Box } from "@mui/material";

export interface IChoice {
  choice_text: string;
  id: string;
}

interface IQuestionOption {
  questionId: number;
  choices: IChoice[];
  setChoices: React.Dispatch<React.SetStateAction<IChoice[]>>;
}

function QuestionOptions({ questionId, choices, setChoices }: IQuestionOption) {
  const addChoiceFn = useAsyncFn(addChoice);

  async function addOption() {
    try {
      const { choice } = (await addChoiceFn.execute({
        question_id: questionId,
        choice_text: `Option ${choices.length + 1}`,
      })) as any;
      setChoices((pre) => [...pre, choice]);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <Box maxWidth={"sm"} mx={"auto"}>
        <Typography
          variant="h5"
          fontSize={"small"}
          noWrap
          mt={2}
          sx={{ my: 2 }}
        >
          Add Option
        </Typography>
        <Stack spacing={1}>
          {choices?.map((c, index) => (
            <QuestionsOptionField
              key={c.id}
              choice={c}
              index={index}
              setChoices={setChoices}
              choices={choices}
            />
          ))}
        </Stack>
        <Box display={"flex"} justifyContent={"center"} mt={2}>
          <Button
            variant="outlined"
            size='small'
            disabled={addChoiceFn.loading}
            onClick={addOption}
          >
            Add Option
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default QuestionOptions;
