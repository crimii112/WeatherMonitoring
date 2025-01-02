import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Header from 'components/Header';
import GraphByStation from 'pages/GraphByStation';
import GraphByWeather from 'pages/GraphByWeather';
import SearchData from 'pages/SearchData';
import Home from 'pages/Home';
import StationGIS from 'pages/StationGis';
import MapProvider from 'components/Map/MapProvider';
import GraphByStationGis from 'pages/GraphByStationGis';

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
            {/* <Route path="/" element={<GraphByStation />} /> */}
            <Route path="/" element={<GraphByStation />} />
            <Route path="/page/2" element={<GraphByWeather />} />
            <Route path="/page/3" element={<SearchData />} />
            <Route
              path="/page/4"
              element={
                <MapProvider id="gis" defaultMode="Base">
                  <StationGIS />
                </MapProvider>
              }
            />
            <Route path="/page/5" element={<GraphByStationGis />} />
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
