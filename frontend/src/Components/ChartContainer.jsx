import * as React from 'react';

import { Chart, ChartTitle, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';

import 'hammerjs';

function ChartContainer({ stackTrack }) {
  const handTrack = [];
  for (let i = 0; i < stackTrack[0][1].length; i += 1) {
    handTrack.push(i);
  }
  return (
    <Chart style={{ color: 'grey' }}>
      <ChartTitle text="Stack Sizes" />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem title={{ text: 'Hands' }} categories={handTrack} />
      </ChartCategoryAxis>
      <ChartSeries>
        {stackTrack.map((item, idx) => (
          <ChartSeriesItem ket={idx} type="line" tooltip={{ visible: true }} data={item[1]} name={item[0]} />
        ))}
      </ChartSeries>
    </Chart>
  );
}

export default ChartContainer;
