import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from '../css/Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <h3>
        <Link to="/">기상수집 모니터링</Link>
      </h3>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.a_active : '')}
            isActive
          >
            측정소별 그래프
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/page/2"
            className={({ isActive }) => (isActive ? styles.a_active : '')}
          >
            데이터별 그래프
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/page/3"
            className={({ isActive }) => (isActive ? styles.a_active : '')}
          >
            기간별 데이터 검색
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/page/4"
            className={({ isActive }) => (isActive ? styles.a_active : '')}
          >
            GIS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/page/5"
            className={({ isActive }) => (isActive ? styles.a_active : '')}
          >
            측정소별 그래프(GIS)
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Header;
