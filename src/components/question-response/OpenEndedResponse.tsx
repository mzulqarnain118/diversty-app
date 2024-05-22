import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

interface IOpenEndedResponseProps {
    questionText: string,
    options: string[],
}
function OpenEndedResponse({ questionText, options }: IOpenEndedResponseProps) {
    return (
        <Paper sx={{ width: '100%', p: 2, my: 2 }} elevation={3}>
            <Typography variant="h6" component="h2">
                {questionText}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: "column", gap: 2, mt: 2, px: 2 }}>
                {options.map((o, idx) => (
                    <Box key={idx} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                        {o}
                    </Box>
                ))}

            </Box>


        </Paper>
    )
}

export default OpenEndedResponse