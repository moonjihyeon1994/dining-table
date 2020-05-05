import styled from "styled-components";
import {theme} from '~css/theme';

export const Test = styled.div``;

export const Box = styled.div`
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 50px;
  font-size: 150%;
`;

export const Layout = styled.div`
  background-color: ${theme.colors.background};
`;

export const HorizonWrapper = styled.div`
  position: relative;
  vertical-align: middle;
`;
