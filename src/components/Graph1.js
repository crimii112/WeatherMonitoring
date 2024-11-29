import React, { useEffect, useState } from 'react';
import { ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import moment from 'moment';
import styles from '../css/Graph.module.css';

function Graph1({ data, ncol }) {
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    const flagIs1 = data.flagList.filter(e => {
      return e.flag === 1;
    });
    if (flagIs1.length > 0) setFlag(1);
  }, [data.flagList]);

  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('MM-DD HH:mm');
  };

  const formatWsAxis = tickFormat => {
    return parseFloat(tickFormat).toFixed(1);
  };

  return (
    <div
      key={data.nodeinfo[0].nodeId}
      className={flag === 0 ? styles.graph : styles.graph_flag}
    >
      <h3 className={flag === 0 ? styles.graph_title : styles.graph_title_flag}>
        {data.nodeinfo[0].nodeNm}
      </h3>
      <div>
        <ComposedChart
          width={ncol === 2 ? 900 : 1800}
          height={310}
          data={data.rstList}
          margin={{ top: 10, bottom: 20, left: 20, right: -5 }}
        >
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Tooltip />
          <XAxis
            dataKey="dt"
            label={{
              value: '측정일시',
              position: 'bottom',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
            fontSize={12}
            tickFormatter={formatXAxis}
          />
          <YAxis
            yAxisId="left-1"
            type="number"
            tickFormatter={formatWsAxis}
            tickCount={10}
            fontSize={12}
            label={{
              value: '풍속(m/s)',
              angle: -90,
              position: 'insideLeft',
              offset: 23,
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          />
          <YAxis
            yAxisId="left-2"
            type="number"
            domain={[0, 360]}
            tickCount={10}
            fontSize={12}
            label={{
              value: '풍향(°)',
              angle: -90,
              position: 'insideLeft',
              offset: 20,
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          />
          <YAxis
            yAxisId="right-1"
            orientation="right"
            type="number"
            tickCount={10}
            tickFormatter={formatWsAxis}
            fontSize={12}
            label={{
              value: '온도(℃)',
              angle: -90,
              position: 'insideRight',
              offset: 20,
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          />
          <YAxis
            yAxisId="right-2"
            orientation="right"
            type="number"
            domain={[0, 100]}
            tickCount={11}
            fontSize={12}
            label={{
              value: '습도(%)',
              angle: -90,
              position: 'insideRight',
              offset: 28,
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          />
          <YAxis
            yAxisId="right-3"
            orientation="right"
            type="number"
            domain={[950, 1050]}
            tickCount={11}
            fontSize={12}
            label={{
              value: '기압(hPa)',
              angle: -90,
              position: 'insideRight',
              offset: 15,
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          />
          <Line
            yAxisId="left-1"
            dataKey="ws"
            name="풍속(m/s)"
            stroke="#cf6655"
          />
          <Line yAxisId="left-2" dataKey="wd" name="풍향(°)" stroke="#859f92" />
          <Line
            yAxisId="right-1"
            dataKey="tmp"
            name="온도(℃)"
            stroke="#bf8fa1"
          />
          <Line
            yAxisId="right-2"
            dataKey="hum"
            name="습도(%)"
            stroke="#6667ab"
          />
          <Line
            yAxisId="right-3"
            dataKey="pressure"
            name="기압(hPa)"
            stroke="#ccb87c"
          />
        </ComposedChart>
      </div>
    </div>
  );
}

export default Graph1;
