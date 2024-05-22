import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import CloseEndedChart from "../sections/response/CloseEndedChart";

interface ICloseEndedResponseProps {
  questionText: string;
  options: {
    count: number;
    choice_text: string;
  }[];
}

function CloseEndedResponse({
  options,
  questionText,
}: ICloseEndedResponseProps) {

    const labels: string[] =[];
    const series: number[] = [];
    options.forEach(opt=>{
        labels.push(opt.choice_text)
        series.push(opt.count)
    })

  return (
    <Paper
      sx={{
        p: 2,
        py: 4,
        my: 2,
      }}
      elevation={3}
    >
      <Typography variant="h6" component="h2">
        {questionText}
      </Typography>
        <CloseEndedChart
          chartSeries={series}
          labels={labels}
        />
    </Paper>
  );
}

export default CloseEndedResponse;
