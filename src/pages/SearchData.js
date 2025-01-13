import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import Button from 'components/Button';
import Table from 'components/Table';
import Loading from 'components/Loading';
import { times } from 'datas/times';
import cmmnStyles from '../css/Common.module.css';

function SearchData() {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/weatheris/srch/datas.do`;
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [date, setDate] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    getStationList();
    getDefaultDate();
  }, []);

  const getStationList = async () => {
    const json = await axios.post(apiUrl, {
      page: 'weather/nodeid',
    });
    setStationList(json.data.rstList);
  };

  const getDefaultDate = () => {
    const currentDate = new Date();
    const beforeOneDayDate = new Date();
    beforeOneDayDate.setDate(beforeOneDayDate.getDate() - 1);

    const json = {
      sDate: moment(beforeOneDayDate).format('YYYY-MM-DD'),
      eDate: moment(currentDate).format('YYYY-MM-DD'),
      time: moment(currentDate).format('HH:00'),
    };

    setDate(json);
  };

  const getFormattedEndDate = e => {
    const eDate = new Date(e);
    eDate.setMinutes(eDate.getMinutes() + 5);
    return moment(eDate).format('YYYY-MM-DD HH:mm:00');
  };

  const getData = async body => {
    setLoading(true);
    const json = await axios.post(apiUrl, body);
    setDatas(json.data);
    setLoading(false);
  };

  const onSubmit = e => {
    e.preventDefault();
    const endDate = getFormattedEndDate(
      `${e.target.endDate.value} ${e.target.endTime.value}`,
    );
    const date = `${e.target.startDate.value} ${e.target.startTime.value};${endDate}`;
    const body = {
      page: 'weather/select2',
      date: date,
      avg: `${e.target.avg.value}`,
      type: 'kma',
      nodeid: `${e.target.nodeid.value}`,
    };
    console.log(body);
    getData(body);
  };

  const exportYN = () => {
    // console.log('clicked save button');
    if (datas.length === 0) {
      alert(
        '저장할 데이터가 존재하지 않습니다.\n검색 후에 저장을 진행해주세요.',
      );
      return false;
    } else {
      const csvData = [
        ['nodeNm', 'dt', 'ws', 'wd', 'tmp', 'hum', 'pressure'],
        ...datas.rstList.map(data => [
          datas.nodeinfo[0].nodeNm,
          data.dt,
          data.ws,
          data.wd,
          data.tmp,
          data.hum,
          data.pressure,
        ]),
      ];
      setCsvData(csvData);
      return true;
    }
  };

  return (
    <div>
      <div className={cmmnStyles.basicDiv}>
        <div className={cmmnStyles.flexNonBorderDiv}>
          <form onSubmit={onSubmit}>
            <div className={cmmnStyles.searchDiv}>
              <select name="nodeid" className={cmmnStyles.selectBox}>
                {stationList.map(station => (
                  <option value={station.nodeId} key={station.nodeId}>
                    {station.nodeNm}
                  </option>
                ))}
              </select>
              <select name="avg" className={cmmnStyles.selectBox}>
                <option value="5m" key="5m">
                  5분 평균
                </option>
                <option value="1h" key="1h">
                  1시간 평균
                </option>
              </select>
            </div>
            <div className={cmmnStyles.searchDateDiv}>
              <input
                type="date"
                name="startDate"
                className={cmmnStyles.inputDate}
                defaultValue={date.sDate}
              />
              <select
                name="startTime"
                className={cmmnStyles.selectBox}
                defaultValue={date.time}
                key={date.time}
              >
                {times.map((time, idx) => (
                  <option key={idx} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              ~&nbsp;
              <input
                type="date"
                name="endDate"
                className={cmmnStyles.inputDate}
                defaultValue={date.eDate}
              />
              <select
                name="endTime"
                className={cmmnStyles.selectBox}
                defaultValue={date.time}
                key={date.time}
              >
                {times.map((time, idx) => (
                  <option key={idx} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Button>검색</Button>
            </div>
          </form>
          <div>
            <button className={cmmnStyles.styled_btn}>
              <CSVLink
                data={csvData}
                filename={`weather_${moment().format('YYYYMMDDHHmm')}`}
                onClick={() => {
                  return exportYN();
                }}
                className={cmmnStyles.csv_a}
              >
                csv 파일로 저장
              </CSVLink>
            </button>
          </div>
        </div>
      </div>
      {loading ? <Loading /> : <Table data={datas} />}
    </div>
  );
}

export default SearchData;
