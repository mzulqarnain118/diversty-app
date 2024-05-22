import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAsync } from "@/hooks/useAsync";
import { getImportQuestions } from "@/services/question.service";
import ImportQuestionItem from "./ImportQuestionItem";
import { Tab, Tabs } from "@mui/material";
import { IQuestion } from "@/types";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  height: "75vh",
  width: "70vw",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  p: 2,
  borderRadius: 4,
  gap: 2,
};

const PAGE_SIZE = 10;

interface IImportQuestionProps {
  onImportQuestion: (q: IQuestion) => void;
  surveyId: string;
  importIdx: number;
  setImportIdx:(n:number)=>void
}

function ImportQuestion({ onImportQuestion, surveyId, importIdx, setImportIdx }: IImportQuestionProps) {
  const handleClose = () => setImportIdx(-1);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [type, setType] = useState<"PUBLIC" | "PRIVATE">("PRIVATE");
  const { data, loading } = useAsync(
    () =>
      getImportQuestions({ limit: PAGE_SIZE, page: page, search: "", type }),
    [page, type]
  );

  useEffect(() => {
    if (!data) return;

    setCount(Math.ceil((data as any)?.count / PAGE_SIZE));
    setQuestions((data as any)?.questions);
  }, [data]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTypeChange = (
    event: React.SyntheticEvent,
    newValue: "PUBLIC" | "PRIVATE"
  ) => {
    setType(newValue);
    setPage(1);
  };

  return (
    <>
      <Modal
        open={importIdx!==-1}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Tabs
            value={type}
            onChange={handleTypeChange}
            aria-label="disabled tabs example"
          >
            <Tab label="My Library" value={"PRIVATE"} />
            <Tab label="Diversalytics Library" value={"PUBLIC"} />
          </Tabs>

          <Box sx={{ overflow: "auto", px: 2, flex: 1, width: "100%" }}>
            <Stack spacing={2}>
              {questions?.map((q: any) => (
                <ImportQuestionItem
                  id={q.id}
                  key={q.id}
                  onImportQuestion={onImportQuestion}
                  surveyId={surveyId}
                  question_text={q.question_text}
                />
              ))}
            </Stack>
          </Box>
          <Pagination count={count} page={page} onChange={handleChange} />
        </Box>
      </Modal>
    </>
  );
}

export default ImportQuestion;
