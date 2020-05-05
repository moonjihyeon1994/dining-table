import * as React from "react";
import styled from "styled-components";
import { HorizonWrapper } from "~css/Layout";
import StarRating from "~components/StarRating";
import ImageView from '~components/ImageView';

export interface ISmallStoreCardProps {
  StoreValue: {
    name: string;
    category: string;
    score: number;
    scoreCnt: number;
    address: string;
  };
}

export function SmallStoreCard(props: ISmallStoreCardProps) {
  const { name, category, score, scoreCnt, address } = props.StoreValue;
  return (
    <Wrapper>
      <TopContainer>
          <ImageView imageUrl="https://www.tibs.org.tw/images/default.jpg" size={3} cover></ImageView>
      </TopContainer>
      <BottomContainer>
        {category}
        <h2>{name}</h2>
        <StyledHorizonWrapper>
          <WrapperRatingText>{score}</WrapperRatingText>
          <StyledStarRating rating={score} size={2}></StyledStarRating>
          <WrapperRatingText>({scoreCnt})</WrapperRatingText>
        </StyledHorizonWrapper>
        {address}
      </BottomContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: inline-block;
  height: 30rem;
  width: 20rem;
  margin: 1rem;
`;

const TopContainer = styled.div`
  height: 60%;
`;

const BottomContainer = styled.div`
  height: 40%;
  background-color: #fffaed;
  padding: 1rem;
`;

const WrapperRatingText = styled.div`
  vertical-align: middle;
  float: left;
`;

const StyledHorizonWrapper = styled.div`
  display: flex;
  line-height: 15px;
`;

const StyledStarRating = styled(StarRating)`
  float: left;
  vertical-align: top;
`;
