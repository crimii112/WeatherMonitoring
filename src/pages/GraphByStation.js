import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import GraphS from 'components/GraphS';
import Button from 'components/Button';
import Loading from 'components/Loading';
import styles from '../css/Graph.module.css';
import cmmnStyles from '../css/Common.module.css';
import Timer from 'components/Timer';

function GraphByStation() {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/weatheris/srch/datas.do`;
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [date, setDate] = useState('');
  const [ncol, setNcol] = useState(2);
  const [defaultSeconds, setdefaultSeconds] = useState(600);
  const [clickedTime, setClickedTime] = useState(moment());
  const dayRef = useRef(1);

  const worker = new Worker(
    new URL('../worker/timerWorker.js', import.meta.url),
  );

  useEffect(() => {
    getDatas(getDate(dayRef.current));
    worker.postMessage(600000);

    return () => worker.terminate();
  }, [defaultSeconds, clickedTime]);

  worker.onmessage = event => {
    console.log(event.data);
    setdefaultSeconds(600);
    setClickedTime(moment());
  };

  /* 현재 시간 기준 date 구하기 */
  const getDate = (selectedDay = 1) => {
    const currentDate = new Date();
    currentDate.setMinutes(Math.floor(currentDate.getMinutes() / 10) * 10);
    const shownEndDate = moment(currentDate).format('YYYY-MM-DD HH:mm:00');
    currentDate.setMinutes(currentDate.getMinutes() + 10); // 10분 간격 -> 현재 시간 + 10분해야 현재 시간까지 데이터 가져옴

    const beforeFewDaysDate = new Date();
    beforeFewDaysDate.setDate(beforeFewDaysDate.getDate() - selectedDay);
    beforeFewDaysDate.setMinutes(
      Math.floor(beforeFewDaysDate.getMinutes() / 10) * 10,
    );

    const startDate = moment(beforeFewDaysDate).format('YYYY-MM-DD HH:mm:00');
    const endDate = moment(currentDate).format('YYYY-MM-DD HH:mm:00');

    setDate(`${startDate} ~ ${shownEndDate}`);
    return `${startDate};${endDate}`;
  };

  /* API 호출 */
  const getDatas = async date => {
    console.log(`(${moment().format('HH:mm:ss')}) Data loading ...`);
    setLoading(true);
    const json = await axios.post(apiUrl, {
      page: 'weather/nodeid',
    });

    let list = [];
    await json.data.rstList.map(async (station, idx, row) => {
      const getDataBody = {
        page: 'weather/select1',
        date: `${date}`,
        minute: '10',
        type: 'kma',
        nodeid: `${station.nodeId}`,
      };
      const getDataRes = await axios.post(apiUrl, getDataBody);

      const getFlagBody = {
        page: 'weather/chk',
        minute: '180',
        type: 'kma',
        nodeid: `${station.nodeId}`,
      };
      const getFlagRes = await axios.post(apiUrl, getFlagBody);

      getDataRes.data.flagList = getFlagRes.data.rstList;
      list = [...list, getDataRes.data];
      list.length === row.length && setDatas(list);
      list.length === row.length && setLoading(false);
    });
  };

  /* 검색 버튼 클릭 이벤트 */
  const onClickSearch = () => {
    console.log('clicked search button');
    setdefaultSeconds(600);
    setClickedTime(moment());
    //getDatas(getDate(dayRef.current));
  };

  /* 열 갯수 라디오 버튼 변경 이벤트 */
  const onChangeNcolRadio = e => {
    setNcol(Number(e.target.value));
  };

  return (
    <div>
      <div className={cmmnStyles.flexDiv}>
        <div className={cmmnStyles.searchDiv}>
          <select
            id="day"
            onChange={e => (dayRef.current = e.target.value)}
            className={cmmnStyles.selectBox}
          >
            <option value={1} key="1">
              1일
            </option>
            <option value={2} key="2">
              2일
            </option>
            <option value={3} key="3">
              3일
            </option>
            <option value={7} key="7">
              일주일
            </option>
          </select>
          <Button onClick={onClickSearch}>검색</Button>
          <Timer defaultSeconds={defaultSeconds} clickedTime={clickedTime} />
        </div>
        <div className={styles.timezone}>
          <h5>{date}</h5>
        </div>
        <div className={cmmnStyles.radioDiv}>
          <label>
            <input
              type="radio"
              value="1"
              name="ncol"
              onChange={onChangeNcolRadio}
            />
            1개씩 보기
          </label>
          <label>
            <input
              type="radio"
              value="2"
              name="ncol"
              onChange={onChangeNcolRadio}
              defaultChecked
            />
            2개씩 보기
          </label>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div
          className={`${styles.graphs} ${ncol === 1 ? styles.graphs_ncol_1 : styles.graphs_ncol_2}`}
        >
          {datas.map(d => {
            return <GraphS data={d} key={d.nodeinfo[0].nodeId} />;
          })}
        </div>
      )}
    </div>
  );
}

export default GraphByStation;
