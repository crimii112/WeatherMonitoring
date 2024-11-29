import React from 'react';
import { DotLoader } from 'react-spinners';
import styled from 'styled-components';

function Loading() {
  return (
    <SpinnerWrapper>
      <DotLoader />
      <h3>Loading...</h3>
    </SpinnerWrapper>
  );
}

export default Loading;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
