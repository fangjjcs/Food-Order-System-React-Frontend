import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import styles from "./styles.module.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { useHttpClient } from "../../../shared/hook/http-hook";
import AuthContext from "../../../shared/context/auth-context";

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
    marginLeft: theme.spacing(1),
    width: "100%",
    backgroundColor: "#E9D8A6",
    // border: "solid #E9D8A6 2px",
    borderRadius: "0.25rem",
  },
}));

const useStylesListItem = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    backgroundColor: "#E9D8A6",
    // border: "solid #E9D8A6 2px",
    borderRadius: "0.25rem",
  },
}));

export default function OrderItemList(props) {
  const classes = useStyles();
  const classesList = useStylesList();
  const classesListItem = useStylesListItem();

  const [isOpen, setIsOpen] = useState(false);
  const [id, setID] = useState(null);
  const [name, setName] = useState("");

  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttpClient();
  const authContext = useContext(AuthContext);
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  const handleDeleteDialogOpen = (event) => {
    setIsOpen(true);
    setName(event.target.innerText);
    setID(event.target.id);
  };

  const handleDelete = () => {
    const request = {
      id: parseInt(id),
      name: name,
    };
    deleteOpenMenu(request);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const deleteOpenMenu = (request) => {
    console.log(request);

    const deleteOpenMenu = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/delete-open-menu",
          "POST",
          JSON.stringify(request),
          header
        );

        if (responseData.status === 403) {
          authContext.logout();
          history.replace("/login");
        } else if (responseData.status === 200) {
          setIsOpen(false);
          window.location.reload();
        }
      } catch (err) {
        // done in http-hook.js
      }
    };
    deleteOpenMenu();
  };

  return (
    <div className={classes.root}>
      {props.list.map((item, key) => {
        return (
          <div className={styles.ListContent} key={key}>
            <DeleteIcon style={{ color: "#e76852" }} />
            <List
              component="nav"
              aria-label={item.name}
              key={item.id}
              className={classesList.root}
              key={key}
            >
              <ListItem
                button
                className={classesListItem.root}
                id={item.id}
                onClick={handleDeleteDialogOpen}
              >
                <ListItemText primary={<div id={item.id}>{item.name}</div>} />
              </ListItem>
            </List>
          </div>
        );
      })}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}
        fullWidth={true}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            刪除今日下午茶 {name} ？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            刪除!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
