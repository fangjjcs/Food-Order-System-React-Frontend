import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, useHistory } from "react-router-dom";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import styles from "./styles.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    backgroundColor: theme.palette.background.paper,
  },
}));

const useStylesList = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    width: "100%",
    backgroundColor: "#E9D8A6",
    // border: "solid #E9D8A6 2px",
    borderRadius: "0.25rem"
  },
}));

export default function OrderItemList(props) {
  const classes = useStyles();
  const classesList = useStylesList();

  return (
    <div className={classes.root}>
      {props.list.map((item, key) => {
        return (
          <div className={styles.ListContent} key={key}>
            <WhatshotIcon style={{ color: "#e76852" }} />
            <List
              component="nav"
              aria-label={item.name}
              key={item.id}
              className={classesList.root}
              key={key}
            >
              <Link
                className={styles.orderLink}
                id={item.id}
                to={{
                  pathname: "/order/" + item.id,
                  item: item,
                }}
              >
                <ListItemText primary={<div id={item.id}>{item.name}</div>} />
              </Link>
            </List>
          </div>
        );
      })}
    </div>
  );
}
