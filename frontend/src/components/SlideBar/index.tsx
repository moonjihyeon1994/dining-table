import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { theme } from "~css/theme";

export interface ISlideBarProps {
    labelText : string;
    alwaysTooltip? : boolean;
    notChange? : boolean;
    min : number;
    max : number;
    value? : number;
}

const useStyles = makeStyles({
  root: {
    width: "90%",
    margin: "auto",
    textAlign: "left"
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

export default function SlideBar(props: ISlideBarProps) {
  const classes = useStyles();
  const {labelText, alwaysTooltip, min, max, notChange, value} = props;
  const [StateValue, setValue] = React.useState(value ? value : 2);
  const handleChange= (event: any, newValue: number | number[]) => {
    if(!notChange){
      setValue(newValue as number);
    }
  }
  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>{labelText}</Typography>
      <PrettoSlider
        value={StateValue}
        min={min}
        max={max}
        step={1}
        draggable
        onChange={handleChange}
        valueLabelDisplay= {alwaysTooltip ? "on" : "auto"}
        aria-labelledby="input-slider"
        // getAriaValueText={"123123"}
      />
    </div>
  );
}
