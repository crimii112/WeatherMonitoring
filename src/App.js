import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import Home from 'pages/Home';
import GraphByStation from 'pages/GraphByStation';
import styled from 'styled-components';

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
            <Route path="/" element={<Home />} />
            <Route path="/page/1" element={<GraphByStation />} />
          </Routes>
        </Body>
      </BrowserRouter>
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 1500px;
  margin: 0 auto;
  padding: 20px;
`;

const Body = styled.div`
  padding: 20px;
`;
