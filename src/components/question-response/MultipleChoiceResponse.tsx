import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import MultipleChoiceChart from "../sections/response/MultipleChoiceChart";

interface IMultipleChoiceResponseProps {
  questionText: string;
  options: {
    choiceCount: number;
    choiceText: string;
  }[];
}

function MultipleChoiceResponse({
  options,
  questionText,
}: IMultipleChoiceResponseProps) {
  const series: number[] = [];
  const labels: string[] = [];

  options.forEach(opt=>{
    series.push(opt.choiceCount);
    labels.push(opt.choiceText);
  })

  return (
    <Paper sx={{ width: "100%", p: 2, my: 2 }} elevation={3}>
      <Typography variant="h6" component="h2">
        {questionText}
      </Typography>
      <MultipleChoiceChart chartSeries={[{data: series}]} labels={labels} />
    </Paper>
  );
}

export default MultipleChoiceResponse;
