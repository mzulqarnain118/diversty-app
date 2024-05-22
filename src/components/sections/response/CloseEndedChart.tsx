import PropTypes from 'prop-types';
import {
  useTheme
} from '@mui/material';
import { Chart } from '@/components/chart';

const useChartOptions = (labels: any) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    labels,
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
  };
};

const CloseEndedChart = ({ chartSeries, labels }: any) => {
  const chartOptions = useChartOptions(labels);

  return (
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width="100%"
        />
  );
};

CloseEndedChart.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};


export default CloseEndedChart;