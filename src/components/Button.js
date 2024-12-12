import React from 'react';
import styled from 'styled-components';

const Button = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Button;

const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: 0;
  background-color: #246beb;
  color: #fff;
  &:hover {
    background-color: #246beb;
    box-shadow: 0 0 5px #246beb;
  }
`;
