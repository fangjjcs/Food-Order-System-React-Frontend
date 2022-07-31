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
import EditDialog from "./EditDialog";

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

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    updateMenu(selectedItem)
    setIsOpen(false);
  };

  const updateMenu = (selectedItem) => {
    console.log(selectedItem)
    setIsEdit(true)
  };

  const handleEditClose = () => {
    setIsEdit(false);
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
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}
        fullWidth={true}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            編輯 {selectedItem.name} ？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleOpen} color="primary" autoFocus>
            編輯!
          </Button>
        </DialogActions>
      </Dialog>
      {isEdit && (
        <EditDialog isOpen={isEdit} onClickCancel={handleEditClose} selectedItem={selectedItem}></EditDialog>
      )}
    </div>
  );
}
