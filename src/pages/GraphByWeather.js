import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import GraphW from 'components/GraphW';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Timer from 'components/Timer';
import { items } from 'datas/items';
import styles from '../css/Graph.module.css';
import cmmnStyles from '../css/Common.module.css';

function GraphByWeather() {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/weatheris/srch/datas.do`;
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [date, setDate] = useState('');
  const [ncol, setNcol] = useState(2);
  const [defaultSeconds, setdefaultSeconds] = useState(3600);
  const [clickedTime, setClickedTime] = useState(moment());
  const dayRef = useRef(2);
  const avgRef = useRef('1h');

  const worker = new Worker(
    new URL('../worker/timerWorker.js', import.meta.url),
  );

  useEffect(() => {
    getDatas(getDate(dayRef.current, avgRef.current), avgRef.current);
    worker.postMessage(avgRef.current === '5m' ? 300000 : 3600000);

    console.log(datas);
    return () => worker.terminate();
  }, [defaultSeconds, clickedTime]);

  worker.onmessage = event => {
    // console.log(event.data);
    setdefaultSeconds(avgRef.current === '5m' ? 300 : 3600);
    setClickedTime(moment());
  };

  /* 현재 시간 기준 date 구하기 */
  const getDate = (selectedDay = 2, selectedAvg = '1h') => {
    const currentDate = new Date();
    const beforeFewDaysDate = new Date();
    let shownEndDate = '';
    let startDate = '';
    let endDate = '';

    if (selectedAvg === '1h') {
      shownEndDate = moment(currentDate).format('YYYY-MM-DD HH:00');
      currentDate.setHours(currentDate.getHours() + 1);

      beforeFewDaysDate.setDate(beforeFewDaysDate.getDate() - selectedDay);

      startDate = moment(beforeFewDaysDate).format('YYYY-MM-DD HH:00');
      endDate = moment(currentDate).format('YYYY-MM-DD HH:00');
    }

    if (selectedAvg === '5m') {
      currentDate.setMinutes(Math.floor(currentDate.getMinutes() / 5) * 5);
      shownEndDate = moment(currentDate).format('YYYY-MM-DD HH:mm');
      currentDate.setMinutes(currentDate.getMinutes() + 5);

      beforeFewDaysDate.setDate(beforeFewDaysDate.getDate() - selectedDay);
      beforeFewDaysDate.setMinutes(
        Math.floor(beforeFewDaysDate.getMinutes() / 5) * 5,
      );

      startDate = moment(beforeFewDaysDate).format('YYYY-MM-DD HH:mm');
      endDate = moment(currentDate).format('YYYY-MM-DD HH:mm');
    }

    setDate(`${startDate} ~ ${shownEndDate}`);
    return `${startDate};${endDate}`;
  };

  /* API 호출 */
  const getDatas = async (date, avg = '5m') => {
    console.log(`(${moment().format('HH:mm:ss')}) Data loading ...`);
    setLoading(true);
    const json = await axios.post(apiUrl, {
      page: 'weather/nodeid',
    });

    let list = [];
    await json.data.rstList.map(async (station, idx, row) => {
      const getDataBody = {
        page: 'weather/select2',
        date: `${date}`,
        avg: `${avg}`,
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
    // console.log('clicked search button');
    // console.log(getDate(dayRef.current, avgRef.current));
    setdefaultSeconds(avgRef.current === '5m' ? 300 : 3600);
    setClickedTime(moment());
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
            defaultValue={2}
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
          <select
            id="avg"
            onChange={e => (avgRef.current = e.target.value)}
            className={cmmnStyles.selectBox}
            defaultValue="1h"
          >
            <option value="5m" key="5m">
              5분 평균
            </option>
            <option value="1h" key="1h">
              1시간 평균
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
          {items.map(i => (
            <GraphW key={i.value} item={i} data={datas} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GraphByWeather;
