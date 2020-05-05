import React from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import Rate from "rc-rate";
import styled from "styled-components";
import "./StarRating.less";

const StyledRate = styled(Rate)`
  &.rc-rate {
    font-size: ${(props: { size: number }) => props.size}px;
  }
`;

const tootipString = [
  "다시 가고 싶지 않아요...",
  "그냥 그래요",
  "보통이었요",
  "맛있습니다!",
  "맨날 가고 싶어요!",
];

interface IStarRatingProps {
    size : number;
}

export default function StarRate(props: IStarRatingProps) {
    const handleChange = (value : number) => {
        alert(value);
    }
  return (
    <div>
      <StyledRate
        size= {props.size}
        defaultValue={3}
        onChange={handleChange}
        characterRender={(node, props) => (
          <Tooltip placement="top" overlay={tootipString[props.index!]}>
            {node}
          </Tooltip>
        )}
      />
    </div>
  );
}
