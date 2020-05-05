import * as React from "react";
import ImageView, { ImageViewProps } from "./ImageView";
import styled from "styled-components";
import CardContent from "./CardContent";
import { theme } from '~css/theme';

export interface ICardProps {
  data: card,
}

export type card = {
  name: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  price_mean: number;
  store_id: number;
  score: number;
  classification: string;
  taste: number;
  service: number;
  price_satisfaction: number;
  interior: number;
}

export function Card(props: ImageViewProps & ICardProps) {
  return (
    <StyledCard>
      <ImageView imageUrl={props.imageUrl} />
      <CardContent
        name={props.data.name}
        classification={props.data.classification}
        address={props.data.address}
        score={props.data.score}
        totalRatingCount={276}
      ></CardContent>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  width: 100%;
  display: inline-block;
  background-color: #ffffff;
  margin: 5px;
  margin-bottom : 1.5rem;
  border-radius: 5px 5px 5px 5px;
  vertical-align: top;
  box-shadow: 0 0 7px 0 rgba(0,0,0,.06);
  &:hover {
    background-color: ${theme.colors.subColor2};
    -webkit-transition: background-color 250ms linear;
    -ms-transition: background-color 250ms linear;
    transition: background-color 250ms linear;
  }
`;
