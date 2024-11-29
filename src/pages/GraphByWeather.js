import React, { useEffect, useRef, useState } from 'react';
import useInterval from 'hook/useInterval';
import moment from 'moment';
import axios from 'axios';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Graph2 from 'components/Graph2';
import { API_URL } from 'config';
import { items } from 'datas/items';
import styles from '../css/Graph.module.css';
import cmmnStyles from '../css/Common.module.css';

function GraphByWeather() {
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [date, setDate] = useState('');
  const [ncol, setNcol] = useState(2);
  const dayRef = useRef(1);
  const avgRef = useRef('5m');

  /* 첫 렌더링 시 */
  useEffect(() => {
    getDatas(getDate());
  }, []);

  /* 5분 간격으로 리렌더링 */
  useInterval(() => {
    console.log('interval call');
    getDatas(getDate());
  }, 300000);

  /* 현재 시간 기준 date 구하기 */
  const getDate = (selectedDay = 1, selectedAvg = '5m') => {
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
      shownEndDate = moment(currentDate).format('YYYY-MM-DD HH:mm:00');
      currentDate.setMinutes(currentDate.getMinutes() + 5);

      beforeFewDaysDate.setDate(beforeFewDaysDate.getDate() - selectedDay);
      beforeFewDaysDate.setMinutes(
        Math.floor(beforeFewDaysDate.getMinutes() / 5) * 5,
      );

      startDate = moment(beforeFewDaysDate).format('YYYY-MM-DD HH:mm:00');
      endDate = moment(currentDate).format('YYYY-MM-DD HH:mm:00');
    }

    setDate(`${startDate} ~ ${shownEndDate}`);
    return `${startDate};${endDate}`;
  };

  /* API 호출 */
  const getDatas = async (date, avg = '5m') => {
    console.log('Data loading ...');
    setLoading(true);
    const json = await axios.post(`${API_URL}`, {
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
      const getDataRes = await axios.post(`${API_URL}`, getDataBody);

      const getFlagBody = {
        page: 'weather/chk',
        minute: '180',
        type: 'kma',
        nodeid: `${station.nodeId}`,
      };
      const getFlagRes = await axios.post(`${API_URL}`, getFlagBody);

      getDataRes.data.flagList = getFlagRes.data.rstList;
      list = [...list, getDataRes.data];
      list.length === row.length && setDatas(list);
      list.length === row.length && setLoading(false);
    });
  };

  /* 검색 버튼 클릭 이벤트 */
  const onClickSearch = () => {
    console.log('clicked search button');
    console.log(getDate(dayRef.current, avgRef.current));
    getDatas(getDate(dayRef.current, avgRef.current), avgRef.current);
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
          <select
            id="avg"
            onChange={e => (avgRef.current = e.target.value)}
            className={cmmnStyles.selectBox}
          >
            <option value="5m" key="5m">
              5분 평균
            </option>
            <option value="1h" key="1h">
              1시간 평균
            </option>
          </select>
          <Button onClick={onClickSearch}>검색</Button>
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
            <Graph2 key={i.value} item={i} data={datas} ncol={ncol} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GraphByWeather;
