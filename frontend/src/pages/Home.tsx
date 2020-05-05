import * as React from 'react';
import styled from "styled-components";
import Footer from "~components/Footer";
import NavBar from "~components/NavBar";
import SideBar from "~components/SideBar";
import MainContent from "~components/MainContent";
// import CardList from '~components/CardList';
import CardListInfinite from '~components/CardListInfinite';
import {Layout} from '~css/Layout';

export interface HomeProps {}

export default class Home extends React.Component<HomeProps> {
  public render() {
    return (
      <LayoutWrapper>
        <NavBar />
        <SideBar />
        <MainContent noPadding={false}>
          <CardListInfinite />
        </MainContent>
        <Footer></Footer>
      </LayoutWrapper>
    );
  }
}

const LayoutWrapper = styled(Layout)`
  display: grid;
  grid-gap: 0.5rem;
  font-size: 1.5rem;
  grid-template-columns: 15% 20% 30% 20% 15%;
  grid-auto-rows: auto;
  grid-template-areas:
    "header header  header  header header"
    ". sidebar content content ."
    ". .       content content ."
    "footer footer  footer  footer footer";
`;
