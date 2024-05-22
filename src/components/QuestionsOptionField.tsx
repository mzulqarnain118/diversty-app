import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';
import { useAsyncFn } from '@/hooks/useAsync';
import { deleteChoice, updateChoice } from '@/services/choice.service';
import { IChoice } from './QuestionOptions';
import _ from 'lodash';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';

interface IQuestionOptionFieldProps {
    index: number
    choice: IChoice
    choices: IChoice[]
    setChoices: React.Dispatch<React.SetStateAction<IChoice[]>>
}



function QuestionsOptionField({ choice, choices, setChoices, index }: IQuestionOptionFieldProps) {
    const updateChoiceFn = useAsyncFn(updateChoice);
    const deleteChoiceFn = useAsyncFn(deleteChoice);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChoiceUpdateDebounce = React.useCallback(
        _.debounce((id: string, choice_text: string) => {
            updateChoiceFn.execute(id, { choice_text }).then(console.log).catch(err => {
                toast.success("Something went wrong!")
            })
        }, 1000),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    function handleChoiceChange(value: string, index: number) {
        const c = [...choices];
        c[index].choice_text = value;
        setChoices(c);
        handleChoiceUpdateDebounce(c[index].id, value);
    }

    function handleDelete() {
        deleteChoiceFn.execute(choice.id).then(res => {
            const c = choices.filter(cc => cc.id != choice.id);
            setChoices(c)
        }).catch(err => {
            toast.error(err?.msg || "Something went wrong!");
        })
    }
    return (
        <>
            <Stack spacing={1} direction={"row"} alignItems={"end"}>
                <TextField variant="standard" fullWidth value={choice.choice_text} key={choice.id} onChange={(e) => handleChoiceChange(e.target.value, index)} />
                {!(updateChoiceFn.loading || deleteChoiceFn.loading) &&
                    <IconButton size='small' onClick={handleDelete} sx={{ p: 1 }}>
                        <DeleteOutlineIcon color='action'fontSize='small' />
                    </IconButton>
                }

                {(updateChoiceFn.loading || deleteChoiceFn.loading) &&
                    <IconButton sx={{ p: 1 }}>
                        <CircularProgress color="inherit" size={24} />
                    </IconButton>
                }
            </Stack>
        </>
    )
}

export default QuestionsOptionField