import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import StoreProvider from './providers/StoreProvider';
import 'moment/locale/ko';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body{
    height: 100%;
    width: 100%;
    font-size: 10px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

ReactDOM.render(
  <StoreProvider>
    <GlobalStyle />
    <App />
  </StoreProvider>,
  document.getElementById('root')
);

