import * as React from "react";
import styled from "styled-components";
import StyledRate from "~components/StarRating/RegStarRating";

interface IVoteRatingProps {}

const VoteRating: React.FunctionComponent<IVoteRatingProps> = (props) => {
  const handleClick = () => {

  }
  return (
    <Wrapper>
      <TextWrapper>
        <b>나도 평가하기</b>
      </TextWrapper>
      <StyledRate size={40}></StyledRate>
    </Wrapper>
  );
};

export default VoteRating;

const Wrapper = styled.div`
  width: 100%;
  float: left;
`;

const TextWrapper = styled.div`
    white-space: pre-line;
    text-align: left;
`;
