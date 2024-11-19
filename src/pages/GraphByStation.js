import axios from 'axios';
import React, { useEffect, useState } from 'react';

function GraphByStation() {
  const [datas, setDatas] = useState([]);
  const [stationList, setStationList] = useState([]);
  const getStationList = async () => {
    const json = await axios.post(
      'http://192.168.0.20:80/weatheris/srch/datas.do',
      {
        page: 'weather/nodeid',
      },
    );
    setStationList(json.data.rstList);
  };

  const getDatas = async body => {
    const json = await axios.post(
      'http://192.168.0.20:80/weatheris/srch/datas.do',
      body,
    );
    setDatas(data => [...data, json.data]);
  };

  useEffect(() => {
    getStationList();
  }, []);

  useEffect(() => {
    stationList.forEach(station => {
      const body = {
        page: 'weather/select1',
        date: '2024-07-01;2024-07-01',
        minute: '10',
        type: 'kma',
        nodeid: `${station.nodeId}`,
      };
      getDatas(body);
    });
  }, [stationList]);

  return (
    <div>
      {datas.length === stationList.length
        ? datas.map(d => {
            console.log(d);
            return (
              <div key={d.nodeinfo[0].nodeId}>
                <h3>{d.nodeinfo[0].nodeNm}</h3>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default GraphByStation;
