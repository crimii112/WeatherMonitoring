import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';
import styled from 'styled-components';
import styles from '../css/Graph.module.css';
import cmmnStyles from '../css/Common.module.css';
import MapProvider from './Map/MapProvider';
import GisMap from 'components/Map/GisMap';

const GraphSG = ({ data }) => {
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    const flagIs1 = data.flagList.filter(e => {
      return e.flag === 1;
    });
    if (flagIs1.length > 0) setFlag(1);
  }, [data]);

  /* x축(측정일시) 포맷 */
  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('MM-DD HH:mm');
  };

  /* y축(풍속) 포맷 */
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
      <div className={cmmnStyles.flexNonBorderDiv}>
        <GraphDiv>
          <ResponsiveContainer width="100%" height={390}>
            <ComposedChart
              data={data.rstList}
              margin={{ top: 10, bottom: 20, left: 10, right: 10 }}
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
              <Line
                yAxisId="left-2"
                dataKey="wd"
                name="풍향(°)"
                stroke="#859f92"
              />
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
          </ResponsiveContainer>
        </GraphDiv>
        <GisDiv>
          <MapProvider id={`${data.nodeinfo[0].nodeId}`} defaultMode="Base">
            <GisMap id={data.nodeinfo[0].nodeId} data={data.nodeinfo} />
          </MapProvider>
        </GisDiv>
      </div>
    </div>
  );
};

export default GraphSG;

const GraphDiv = styled.div`
  width: 100%;
`;

const GisDiv = styled.div`
  padding: 5px;
  width: 30%;
`;
