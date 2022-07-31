import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import Fastfood from "@material-ui/icons/Fastfood";

import styles from "./styles.module.css";
import Chip from "./widget/Chip";


export default function SimplePaper(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        marginTop: theme.spacing(1),
        width: theme.spacing(props.width)
      },
    },
  }));
  const classes = useStyles();
  const paperHeight = window.innerHeight-280;
  const initWidth = window.innerWidth -192;
  const paperWidth = props.type === "order" ? initWidth / 2 : initWidth / 4;

  return (
    <div className={styles.content}>
      {props.type === "food" && <Chip icon={<RestaurantIcon style={{ color: "#30374e" }} />} label="Maintain" />}
      {props.type === "drink" && (
        <Chip icon={<FreeBreakfastIcon style={{ color: "#30374e"}}/>} label="Maintain" />
      )}
      {props.type === "order" && (
        <Chip icon={<Fastfood style={{ color: "#30374e" }}/>} label="Maintain Today's Menu" />
      )}
      <div className={classes.root} >
        <Paper elevation={3} className='paper-shadow' style={{width: paperWidth, height: paperHeight}}>{props.children}</Paper>
      </div>
    </div>
  );
}
