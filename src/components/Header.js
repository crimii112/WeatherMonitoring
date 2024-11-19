import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Header.module.css';

function Header() {
  return (
    <div className={styles.header}>
      <h3>
        <Link to="/">기상수집 모니터링</Link>
      </h3>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/page/1">측정소별 그래프</Link>
        </li>
        <li>
          <Link to="/page/2">데이터별 그래프</Link>
        </li>
        <li>
          <Link to="/page/3">기간별 데이터 검색</Link>
        </li>
      </ul>
    </div>
  );
}

export default Header;
