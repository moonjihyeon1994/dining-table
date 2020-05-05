import * as React from "react";
import SlideBar from "./SlideBar";
import { HorizonWrapper } from "~css/Layout";
import styled from "styled-components";

export interface RangeSlideList {}

export type SlideData = {
  text: string;
  rating: number;
};

const testData: SlideData[] = [
  { text: "맛", rating: 1 },
  { text: "분위기", rating: 2 },
  { text: "가격", rating: 3 },
  { text: "서비스", rating: 4 },
  { text: "미식", rating: 5 },
];

// const RangeSlideMap: any = testData.map((item, i) => (
//   <SlideBar key={i} rating={item} />
// ));

export default function RangeSlideList(props: RangeSlideList) : any {
  return testData.map((item, i) => {
    return (
      <StyledHorizonWrapper key={i}>
        <TextWrapper>{item.text}</TextWrapper>
        <SlideBarWrapper>
          <SlideBar rating={item.rating}></SlideBar>
        </SlideBarWrapper>
      </StyledHorizonWrapper>
    );
  });
}

const StyledHorizonWrapper = styled(HorizonWrapper)`
  height: 3rem;
  vertical-align: middle;
`;

const SlideBarWrapper = styled.div`
  float: left;
  margin-left: 1rem;
  width: 70%;
`;

const TextWrapper = styled.div`
  float: left;
  width: 7rem;
  font-size: 2rem;
  text-align: right;
`;
