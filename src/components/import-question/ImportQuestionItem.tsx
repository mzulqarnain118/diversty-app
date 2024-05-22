import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAsyncFn } from '@/hooks/useAsync';
import CircularProgress from '@mui/material/CircularProgress';
import { importQuestion } from '@/services/question.service';
import TextField from '@mui/material/TextField';

interface IImportQuestionItemProps {
    question_text: string,
    id: string,
    onImportQuestion: (q: any) => void,
    surveyId: string
}

function ImportQuestionItem({ id, question_text, onImportQuestion, surveyId }: IImportQuestionItemProps) {
    const importQuestionFn = useAsyncFn(importQuestion);
    const [value, setValue] = useState(question_text);
    function handleClick() {
        importQuestionFn.execute(id, surveyId, value).then(res => {
            onImportQuestion((res as any)?.question)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <Stack spacing={2} key={id} direction={"row"} alignItems={"center"} sx={{ p: 2,pb:0, border: "1px solid rgba(0,0,0,0.2)", borderRadius: 2 }}>
            <Box sx={{ flex: 1 }}>
                <TextField fullWidth multiline minRows={2} value={value} onChange={(e) => setValue(e.target.value)} label="Question" variant='standard' />
            </Box>
            <Box>
                <Button onClick={handleClick} disabled={importQuestionFn.loading} >{importQuestionFn.loading ? <CircularProgress color="inherit" size={25} /> : "Import"}</Button>
            </Box>
        </Stack>
    )
}

export default ImportQuestionItem