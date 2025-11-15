import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler plugin for area under the line
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register all the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register Filler
);

/**
 * A reusable Line chart component specifically for the climate dashboard.
 * It accepts chartData and options as props to be highly configurable.
 */
const TrendChart = ({ chartData, options, title }) => {
  // We don't use the 'title' prop here, as the H3 is now in Heatmap.js
  // But we keep it in the props in case you use it elsewhere.

  return <Line data={chartData} options={options} />;
};

export default TrendChart;