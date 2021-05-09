import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from './Components.module.css';

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          zeroLineColor: '#ffcc33',
        },
      },
    ],
  },
  legend: {
    display: true,
    labels: {
      fontColor: '#ffffff',
    },
  },
};

const randomColour = () => `hsl(${360 * Math.random()},${100}%,${60}%)`;

function LineChart({ stackTrack }) {
  const handTrack = [];
  for (let i = 0; i < stackTrack[0][1].length; i += 1) {
    handTrack.push(i);
  }
  const datasets = [];
  stackTrack.forEach((element) => {
    const colour = randomColour();
    datasets.push({
      label: element[0],
      data: element[1],
      fill: false,
      backgroundColor: colour,
      borderColor: colour,
    });
  });
  const data = {
    labels: handTrack,
    datasets,
  };
  return (
    <>
      <h1 className={styles.title}>Stack Track</h1>
      <Line data={data} options={options} />
    </>
  );
}

export default LineChart;
