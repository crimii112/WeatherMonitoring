import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
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
import { colors } from 'datas/colors';
import styles from '../css/Graph.module.css';

const GraphW = ({ item, data }) => {
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    let list = [];
    data.forEach(d => {
      list = [...list, d.flagList.filter(e => e.itemnm === item.name)[0]];
    });
    const flagIs1 = list.filter(e => e.flag === 1);
    if (flagIs1.length > 0) setFlag(1);
  }, [item, data]);

  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('MM-DD HH:mm');
  };
  const formatWsAxis = tickFormat => {
    return parseFloat(tickFormat).toFixed(1);
  };

  return (
    <div className={flag === 0 ? styles.graph : styles.graph_flag}>
      <h3 className={flag === 0 ? styles.graph_title : styles.graph_title_flag}>
        {item.name}
        {item.unit}
      </h3>
      <GraphDiv>
        <ResponsiveContainer width="100%" height={390}>
          <ComposedChart
            data={data}
            margin={{ top: 10, bottom: 20, left: 10, right: 20 }}
          >
            <XAxis
              dataKey="dt"
              allowDuplicatedCategory={false}
              tickFormatter={formatXAxis}
              label={{
                value: '측정일시',
                position: 'bottom',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
              fontSize={12}
              padding={{ left: 10, right: 10 }}
            />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <Tooltip />
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <YAxis
              yAxisId="left"
              type="number"
              domain={item.domain}
              tickCount={item.tickCount}
              fontSize={12}
              label={{
                value: `${item.name}${item.unit}`,
                angle: -90,
                position: 'insideLeft',
                offset: 15,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              tickFormatter={
                (item.value === 'ws' || item.value === 'tmp') && formatWsAxis
              }
            />
            {data.map((d, idx) => (
              <Line
                data={d.rstList}
                key={idx}
                yAxisId="left"
                dataKey={item.value}
                name={d.nodeinfo[0].nodeNm}
                stroke={colors[idx]}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </GraphDiv>
    </div>
  );
};

export default GraphW;

const GraphDiv = styled.div`
  width: 100%;
`;
