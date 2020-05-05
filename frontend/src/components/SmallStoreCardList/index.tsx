import * as React from "react";
import styled from "styled-components";
import { SmallStoreCard } from "./SmallStoreCard";

export interface ISmallStoreCardListProps {}

const testData = [
  {
    name: "경복궁",
    category: "한식",
    score: 3.8,
    scoreCnt: 120,
    address: "서울특별시 마포구 동교동",
  },
  {
    name: "소풍",
    category: "한식",
    score: 4.1,
    scoreCnt: 41,
    address: "서울특별시 마포구 동교동",
  },
  {
    name: "이모네감자탕",
    category: "한식",
    score: 3.9,
    scoreCnt: 56,
    address: "서울특별시 마포구 동교동",
  },
  {
    name: "항아리보쌈",
    category: "한식",
    score: 5,
    scoreCnt: 23,
    address: "서울특별시 마포구 동교동",
  },
  {
    name: "가츠라멘",
    category: "일식",
    score: 4.2,
    scoreCnt: 51,
    address: "서울특별시 마포구 동교동",
  },
  {
    name: "Pizzeria",
    category: "양식",
    score: 3.1,
    scoreCnt: 66,
    address: "서울특별시 마포구 동교동",
  },
  {
    name: "도네누",
    category: "한식",
    score: 3.3,
    scoreCnt: 91,
    address: "서울특별시 마포구 동교동",
  },
];

const CardMap = testData.map((item, i) => (
  <SmallStoreCard key={i} StoreValue={item}></SmallStoreCard>
));

export function SmallStoreCardList(props: ISmallStoreCardListProps) {
  return (
    <Wrapper>
      <RightMoreArrow> > </RightMoreArrow>
      {CardMap}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const RightMoreArrow = styled.div`
  position: sticky;
  left: 93%;
  top: 50%;
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
  background-color: white;
  font-size: 2rem;
  text-align: center;
`;
