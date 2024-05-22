import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import { Chart } from '@/components/chart';

const useChartOptions = (labels:any[]) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        // columnWidth: '40px'
        horizontal: true,
      }
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: labels,
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val:any) {
          return val
        },
        title: {
          enabled: false,
          formatter: function (seriesName: any) {
            return null
          }
        }
      }
    }
  };
};

const MultipleChoiceChart = ({chartSeries, labels}: any) => {
  const chartOptions = useChartOptions(labels);

  return (
        <Chart
          height={350}
          options={chartOptions as any}
          series={chartSeries}
          type="bar"
          width="100%"
        />
  );
};

MultipleChoiceChart.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};


export default MultipleChoiceChart;