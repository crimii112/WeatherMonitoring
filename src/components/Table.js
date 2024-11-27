import React from 'react';
import styles from '../css/Table.module.css';
import cmmnStyles from '../css/Common.module.css';

function Table({ data }) {
  return (
    <div className={cmmnStyles.basicDiv}>
      {data.length === 0 ? (
        <h4 className={cmmnStyles.text_center}>
          현재 데이터가 존재하지 않습니다. 원하는 정보를 검색해보세요.
        </h4>
      ) : (
        <table>
          <thead className={styles.thead}>
            <tr>
              <th>측정소</th>
              <th>측정일시</th>
              <th>풍속(m/s)</th>
              <th>풍향(°)</th>
              <th>온도(℃)</th>
              <th>습도(%)</th>
              <th>기압(hPa)</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.rstList.map(d => (
              <tr key={d.dt} className={styles.tr}>
                <td>{data.nodeinfo[0].nodeNm}</td>
                <td>{d.dt}</td>
                <td>{d.ws}</td>
                <td>{d.wd}</td>
                <td>{d.tmp}</td>
                <td>{d.hum}</td>
                <td>{d.pressure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
