import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import Fastfood from "@material-ui/icons/Fastfood";

import styles from "./styles.module.css";


export default function SimplePaper(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(1),
        width: theme.spacing(props.width),
        height: theme.spacing(56),
      },
    },
  }));
  const classes = useStyles();

  return (
    <div className={styles.content}>
      {props.type === "food" && <Chip icon={<RestaurantIcon style={{ color: "#e76852" }} />} label="管理口袋食物" />}
      {props.type === "drink" && (
        <Chip icon={<FreeBreakfastIcon style={{ color: "#e76852" }}/>} label="管理口袋飲料" />
      )}
      {props.type === "order" && (
        <Chip icon={<Fastfood style={{ color: "#e76852" }}/>} label="管理今日下午茶" />
      )}
      <div className={classes.root}>
        <Paper elevation={3}>{props.children}</Paper>
      </div>
    </div>
  );
}
