import * as React from "react";
import styled from "styled-components";
import Category from "~components/DetailCategory";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { FaSistrix } from "react-icons/fa";
import { theme } from "~css/theme";
import { inject, observer } from "mobx-react";
import { STORES } from "~constants";
import SidebarStore from "~stores/sidebar/SidebarStore";

export interface SideBarProps {
  sidebarStore?: SidebarStore;
}

const useStyles = makeStyles({
  root: {
    width: "90%",
    margin: "auto",
  },
});

const PrettoSlider = withStyles({
  root: {
    color: theme.colors.mainColor,
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function valuetext(value: number) {
  return `${value}원`;
}
const categories = ['한식','일식','양식','중식','뷔페','까페','주점','세계음식'];

export default inject(STORES.SIDEBAR_STORE)(
  observer(({ sidebarStore }: SideBarProps) => {
    const classes = useStyles();
    const handleFilterPriceChange = (event: any, newValue: number | number[]) => {
      sidebarStore?.setPrice(newValue as number[]);
    };

    const handleFilterTypeChange = (newValue : number) => {
      sidebarStore?.setType(newValue);
    };

    const handleKeyPress = (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(event.target.value);
      sidebarStore?.searchListAutoComplate(event.target.value.trim());
    }

    const handlePlaceClick = () => {
      
    }
    
    const placeMap = sidebarStore?.hotPlaces.map((item, i) => <RegionBtn key={i} isChecked={false}>{item}</RegionBtn>);

    React.useEffect(()=>{
      sidebarStore!.reqGetStoreList();
      console.log(placeMap);
    })
    return (
      <SD>
        <Category size={1.5} text={"종류"} marginTop={1} marginBottom={1} />
        <BtnWrapper>
          <CustomBtn isChecked={sidebarStore?.type == 'recommend'} onClick={() => handleFilterTypeChange(0)}>
            추천순
          </CustomBtn>
          <CustomBtn isChecked={sidebarStore?.type == 'rating'} onClick={() => handleFilterTypeChange(1)}>
            평점순
          </CustomBtn>
        </BtnWrapper>
        <Category size={1.5} text={"가격"} marginTop={8} marginBottom={5} />
        <div className={classes.root}>
          <Typography id="range-slider" gutterBottom></Typography>
          <PrettoSlider
            value={sidebarStore?.price}
            min={5000}
            max={50000}
            step={5000}
            onChange={handleFilterPriceChange}
            valueLabelDisplay="on"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
          />
        </div>
        <Category size={1.5} text={"지역"} marginTop={8} marginBottom={1} />
        <InputWrapper>
          <StyledFaSistrix />
          <StyledInput onChange={handleKeyPress}
            type="search"
            placeholder="지역을 입력해주세요..."
          ></StyledInput>
        </InputWrapper>
        <RegionSearchWrapper>
          {/* <RegionBtn isChecked={false}>강남</RegionBtn>
          <RegionBtn isChecked={false}>역삼</RegionBtn>
          <RegionBtn isChecked={false}>삼성</RegionBtn>
          <RegionBtn isChecked={false}>선릉</RegionBtn>
          <RegionBtn isChecked={false}>홍대입구</RegionBtn>
          <RegionBtn isChecked={false}>이태원</RegionBtn>
          <RegionBtn isChecked={false}>압구정</RegionBtn>
          <RegionBtn isChecked={false}>청담</RegionBtn>
          <RegionBtn isChecked={false}>수원</RegionBtn>
          <RegionBtn isChecked={false}>봉담</RegionBtn>
          <RegionBtn isChecked={false}>오류</RegionBtn>
          <RegionBtn isChecked={false}>인천</RegionBtn>
          <RegionBtn isChecked={false}>의정부</RegionBtn> */}
          {placeMap}
        </RegionSearchWrapper>
        <Category size={1.5} text={"음식종류"} marginTop={8} marginBottom={1} />
        <FoodCategoryWrapper>
          {categories.map((item, i)=> <FoodCategory key={i} isChecked={sidebarStore?.isCategoriesClick[i]===true} onClick={() => sidebarStore?.setCategoriesClick(i)}>{item}</FoodCategory>)}
        </FoodCategoryWrapper>
        <Category size={1.5} text={""} marginTop={4} marginBottom={1} />
      </SD>
    );
  })
);



const SD = styled.div`
  grid-area: sidebar;
  /* background-color: ${theme.colors.background}; */
  background-color: white;
  box-shadow: 0 0 7px 0 rgba(0,0,0,.06);
  border-radius: 15px;
  padding: 1rem;
  margin-top: 10rem;
  min-height: 80rem;
  max-height: auto;
`;

const RegionSearchWrapper = styled.div`
  position: relative;
  height: 15rem;
`;

const RegionBtn = styled.div`
  float: left;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border: solid 1px ${theme.colors.mainColor};
  border-radius: 20px;
  margin: 0.5rem 0.5rem 0.5rem 0.5rem;
  background-color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? theme.colors.mainColor : "inherit"};
  -webkit-transition: background-color 150ms linear;
  -ms-transition: background-color 150ms linear;
  transition: background-color 150ms linear;
  cursor: pointer;
`;

const BtnWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
`;

const CustomBtn = styled.div`
  text-align: center;
  color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? "white" : "black"};
  padding: 1rem;
  flex-grow: 1;
  margin: 0 1rem 0 1rem;
  border-radius: 57px;
  border: solid 1px ${theme.colors.mainColor};
  background-color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? theme.colors.mainColor : "inherit"};
  -webkit-transition: background-color 150ms linear;
  -ms-transition: background-color 150ms linear;
  transition: background-color 150ms linear;
  cursor: pointer;
`;

const FoodCategoryWrapper = styled.div`
  position: relative;
  height: 10rem;
`;

const FoodCategory = styled.div`
  float: left;
  width: 20%;
  background-color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? theme.colors.mainColor : "inherit"};
  border: solid 1px ${theme.colors.mainColor};
  text-align: center;
  padding: 0.5rem;
  border-radius: 20px;
  margin: 2%;
  cursor: pointer;

  color: ${(props: { isChecked: boolean }) =>
    props.isChecked ? "white" : "black"};

  -webkit-transition: background-color 150ms linear;
  -ms-transition: background-color 150ms linear;
  transition: background-color 150ms linear;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const StyledFaSistrix = styled(FaSistrix)`
  flex-grow: 1;
`;

const StyledInput = styled.input`
  background-color: inherit;
  height: 3rem;
  flex-grow: 9;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: solid 0px;
  border-bottom: solid 1px gray;
  float: left;
`;
