import * as React from "react";
import styled from "styled-components";

interface SlideBarProps {
  rating: number;
  isPercent? : boolean;
}

class SlideBar extends React.Component<SlideBarProps> {
  render() {
    const { rating, isPercent } = this.props;
    return (
      <StyledSlideBar>
        <StyledSlideCursor rating={rating}>
          <Tooltip>{isPercent ? rating * 20 : rating}</Tooltip>
        </StyledSlideCursor>
      </StyledSlideBar>
    );
  }
}

export default SlideBar;

const StyledSlideBar = styled.div`
  position: relative;
  height: 8px;
  width: 100%;
  background-color: #ededed;
  border-radius: 5px;
  margin: 1rem;
`;

const StyledSlideCursor = styled.div`
  position: absolute;
  left: ${(props: { rating: number }) => (props.rating - 1) * 22.5 + "%"};
  height: inherit;
  width: 10%;
  background-color: #fcba03;
  border-radius: 5px;

  & > span {
    visibility: hidden;
  }

  &:hover > span {
    visibility: visible;
  }
`;

const Tooltip = styled.span`
  width: 40px;
  background-color: #636363;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  bottom: 10px;
  left: 35%;
  /* -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out; */
`;
