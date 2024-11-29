import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import GraphByStation from 'pages/GraphByStation';
import GraphByWeather from 'pages/GraphByWeather';
import SearchData from 'pages/SearchData';
import styled from 'styled-components';
import Home from 'pages/Home';

function App() {
  return (
    <Container>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Header />
        <Body>
          <Routes>
            <Route path="/" element={<Home />} />/
            <Route path="/page/1" element={<GraphByStation />} />
            <Route path="/page/2" element={<GraphByWeather />} />
            <Route path="/page/3" element={<SearchData />} />
          </Routes>
        </Body>
      </BrowserRouter>
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  margin: 0;
`;

const Body = styled.div`
  padding: 10px;
`;
