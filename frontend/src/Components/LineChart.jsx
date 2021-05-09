import React from 'react';
import { Line } from 'react-chartjs-2';

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
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
      <div className="header">
        <h1 className="title">Stack Track</h1>
      </div>
      <Line id="ben" data={data} options={options} />
    </>
  );
}

export default LineChart;
