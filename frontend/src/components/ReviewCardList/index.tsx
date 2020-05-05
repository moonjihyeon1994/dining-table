import * as React from "react";
import ReviewCard from "./ReviewCard";
import styled from "styled-components";
import { ReviewCardModel } from '~stores/detail/DetailStroe';

export interface CardListProps {
    reviewList : ReviewCardModel[];
}

export default function ReviewCardList(props: CardListProps) {
  const CardMap: any = props.reviewList.map((item, i) => <ReviewCard key={i} review={item} />);
  return <Wrapper>{CardMap}</Wrapper>;
}

const Wrapper = styled.div`
  margin: 0 2rem 0 2rem;
`;
