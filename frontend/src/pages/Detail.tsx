import * as React from "react";
import styled from "styled-components";
import Footer from "~components/Footer";
import NavBar from "~components/NavBar";
import MainContent from "~components/MainContent";
import RangeSlide from "~components/RangeSlide";
import DetailInfo from "~components/DetailInfo";
import DetailCategory from "~components/DetailCategory";
import VoteRating from "~components/VoteRating";
import ReviewCardList from "~components/ReviewCardList";
import {SmallStoreCardList} from '~components/SmallStoreCardList';
import { Layout } from '~css/Layout';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { STORES } from '~constants';
import DetailStore from '~stores/detail/DetailStroe';
import { toJS } from 'mobx';

export interface DetailProps {
  detailStore : DetailStore;
}

@inject(STORES.DETAIL_STORE)
@observer
class Detail extends React.Component<DetailProps & RouteComponentProps> {
  componentDidMount() {
    this.props.detailStore.init(this.props.match.params["storeId"]);
  }

  public render() {
    const {match, detailStore} = this.props;
    const handleClick = () => {
    }
    return (
      <LayoutWrapper>
        <NavBar></NavBar>
        <DetailInfo detailInfo={detailStore.storeInfo}></DetailInfo>
        <MainContent noPadding>
          <DetailCategory text={"미식단의 평가"} size={2} marginTop={3} marginBottom={3} />
          <WrapperDetailMainContainer>
            <DetailLeftContainer>
              <RangeSlide />
              <DetailCategory text={"방문자 리뷰"} size={2} marginTop={5} marginBottom={3} />
              <ReviewCardList reviewList={toJS(detailStore.reviewsTop3)} />
              <ReviewMoreBtn onClick={handleClick}>More</ReviewMoreBtn>
              <DetailCategory text={"비슷한 음식점"} size={2} marginTop={5} marginBottom={3} />
              <SmallStoreCardList />
            </DetailLeftContainer>
            <DetailRightContainer>
              <VoteRating />
            </DetailRightContainer>
          </WrapperDetailMainContainer>
        </MainContent>
        <Footer></Footer>
      </LayoutWrapper>
    );
  }
}

export default withRouter(Detail);

const LayoutWrapper = styled(Layout)`
  display: grid;
  grid-gap: 0.5rem;
  font-size: 1.5rem;
  grid-template-columns: 15% 69% 15%;
  grid-auto-rows: auto;
  grid-template-areas:
    "header header header"
    "detail detail detail"
    ". content ."
    "footer footer footer";
`;

const DetailLeftContainer = styled.div`
  float: left;
  width: 65%;
  height: 100%;
`;

const DetailRightContainer = styled.div`
  float: left;
  width: 35%;
  height: 100%;
  padding: 0 3rem 0 3rem;
`;

const WrapperDetailMainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ReviewMoreBtn = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
`;
