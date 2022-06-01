import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useHttpClient } from "../../../shared/hook/http-hook";
import { useHistory } from "react-router-dom";
import AuthContext from "../../../shared/context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const useStylesList = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
}));

const useStylesListItem = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    backgroundColor: "#E9D8A6",
    // border: "solid #E9D8A6 2px",
    borderRadius: "0.25rem"
  },
}));


export default function MenuItemList(props) {
  const classes = useStyles();
  const classesList = useStylesList();
  const classesListItem = useStylesListItem();

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
      id: null,
      name: ""
  });

  const { isLoading, error, sendRequest } = useHttpClient();
  const history = useHistory();

  const authContext = useContext(AuthContext);
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  const handleClickOpen = (e) => {
    setSelectedItem({
        id: parseInt(e.target.id),
        name: e.target.innerText
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    updateOpen(selectedItem)
    setOpen(false);
  };

  const updateOpen = (selectedItem) => {
      console.log(selectedItem)
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/update-open",
          "POST",
          JSON.stringify(selectedItem),
          header
        );

        console.log(responseData);
        if (responseData.status === 403) {
          authContext.logout();
          history.replace("/login");
        } else if (responseData.status === 200) {
            window.location.reload();
        }
      } catch (err) {
        // done in http-hook.js
      }
    };
    fetchData();
  };

  return (
    <div className={classes.root}>
      {props.list.map((item) => {
        return (
          <List
            component="nav"
            aria-label={item.name}
            key={item.id}
            className={classesList.root}
          >
            <ListItem
              button
              className={classesListItem.root}
              id={item.id}
              onClick={handleClickOpen}
            >
              <ListItemText primary={<div  id={item.id} >{item.name}</div>}/>
            </ListItem>
          </List>
        );
      })}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}
        fullWidth={true}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            新增 {selectedItem.name} 為今日下午茶？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleOpen} color="primary" autoFocus>
            開單!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
