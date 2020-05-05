import * as React from "react";
import styled from "styled-components";
import StarRating from "~components/StarRating";

interface ICardContentProps {
  category: string;
  title: string;
  address: string;
  rating: number;
  totalRatingCount: number;
}

const CardContent: React.FunctionComponent<ICardContentProps> = props => {
  return (
    <StyledCardContent>
      <Category>{props.category}</Category>
      <Title>
        <b>{props.title}</b>
      </Title>
      <Address>
        <p>{props.address}</p>
      </Address>
      <RatingWrapper>
        <Rating>
          <b>{props.rating}</b>
        </Rating>
        <StyledStarRating>
          <StarRating rating={4} size={1} />
          {props.totalRatingCount}명 평가
        </StyledStarRating>
      </RatingWrapper>
    </StyledCardContent>
  );
};

export default CardContent;

const StyledCardContent = styled.div`
  position: relative;
  display: inline-block;
  color: black;
  font-size: 1rem;
  min-width: 30%;
  height: 22rem;
  margin: 1rem;
  padding-right: 2rem;
  vertical-align: top;
  box-sizing: content-box;
  border-right: solid 1px;
  border-color: #d3d3d3;
`;

const Title = styled.div`
  font-size: 3rem;
  padding: 0 0 0 0;
`;

const Category = styled.div`
  padding: 0.5rem 0 0 0.5rem;
`;

const Address = styled.div`
  font-size: 1.5rem;
  padding: 0.5rem 0.5rem;
  color: gray;
`;

const RatingWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 2rem;
`;

const Rating = styled.div`
  float: right;
  font-size: 3rem;
`;

const StyledStarRating = styled.div`
  width: 6rem;
  float: right;
  margin-top: 0.9rem;
  line-height: 1.1rem;
  text-align: center;
`;
