import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useHttpClient } from "../../../shared/hook/http-hook";
import { useHistory } from "react-router-dom";
import MenuItem from "./widget/MenuItem";
import { useDispatch, useSelector } from "react-redux";

import { logout } from '../../../store/ui-action'
import { getOpenedMenu } from '../../../store/menu-actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MenuItemList(props) {

  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState({
      id: null,
      name: ""
  });

  const { isLoading, error, sendRequest } = useHttpClient();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector( state => state.ui.token);

  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + token);

  const handleClickOpen = (id, name) => {
    setSelectedItem({
        id: parseInt(id),
        name: name
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    updateOpen(selectedItem);
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
          dispatch(logout());
          history.replace("/login");
        } else if (responseData.status === 200) {
            dispatch(getOpenedMenu(token, history))
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
          <MenuItem name={item.name} id={item.id} handleClickOpen={handleClickOpen}></MenuItem>
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
            新增 {selectedItem.name} 為今日下午茶?
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
