import React, { Fragment, useContext, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormHelperText,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import { Restaurant, Fastfood, Info } from "@material-ui/icons";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import "./EditDialog.css";
import { useHttpClient } from "../../../shared/hook/http-hook";
import AuthContext from "../../../shared/context/auth-context";
import { useHistory } from "react-router-dom";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#28464b",
      darker: "#053e85",
    },
    neutral: {
      main: "#28464b",
      contrastText: "#fff",
    },
  },
});

const EditDialog = (props) => {
  const [isError, setIsError] = useState(false);

  const id = props.selectedItem.id;
  const [menuName, setMenuName] = useState(props.selectedItem.name);
  const [type, setType] = useState("");
  const [fileString, setFileString] = useState("");
  const [memo, setMemo] = useState("");

  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttpClient();
  const authContext = useContext(AuthContext);
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  useEffect(() => {
    fetchData(props.selectedItem);
  }, []);

  const handleNameChange = (event) => {
    setMenuName(event.target.value);
  };

  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const checkEmpty = () => {
    if (menuName === "" || type === "") {
      setIsError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const checkPass = checkEmpty();
    const request = {
      id: id,
      name: menuName,
      type: type,
      memo: memo,
      fileString: fileString,
    };
    console.log(checkPass, request);
    if (checkPass) {
      updateMenu(request);
      // props.onClickCancel();
      // window.location.reload();
    }
  };

  const fetchData = (request) => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/get-menu",
          "POST",
          JSON.stringify(request),
          header
        );

        if (responseData.status === 403) {
          authContext.logout();
          history.replace("/login");
        } else if (responseData.status === 200) {
          console.log(responseData);
          setType(responseData.menu.type);
          setFileString(responseData.menu.fileString);
          setMemo(responseData.menu.memo);
        }
      } catch (err) {
        // done in http-hook.js
      }
    };
    fetchData();
  };

  const updateMenu = (request) => {
    const updateMenu = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/update-menu",
          "POST",
          JSON.stringify(request),
          header
        );

        if (responseData.status === 403) {
          authContext.logout();
          history.replace("/login");
        } else if (responseData.status === 200) {
          console.log(responseData);
          props.onClickCancel();
          window.location.reload();
        }
      } catch (err) {
        // done in http-hook.js
      }
    };
    updateMenu();
  };

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setFileString(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    props.onClickCancel();
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">修改菜單 : </DialogTitle>
      <DialogContent className="order-content">
        <ThemeProvider theme={theme}>
          <Box className="edit-content-box">
            <div className="upload-content">
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  上傳照片
                </Button>
              </label>
              <input
                accept="image/*"
                className="upload-btn"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleImgChange}
              />
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  店家名稱
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <Restaurant />
                    </InputAdornment>
                  }
                  value={menuName}
                  onChange={handleNameChange}
                />
                {isError && menuName === "" && (
                  <FormHelperText error>Can not be empty</FormHelperText>
                )}
              </FormControl>
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  類型
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  startAdornment={
                    <InputAdornment position="start">
                      <Fastfood />
                    </InputAdornment>
                  }
                  value={type}
                  onChange={handleTypeChange}
                >
                  <MenuItem value={"food"}>食物</MenuItem>
                  <MenuItem value={"drink"}>飲料</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  其他資訊
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <Info />
                    </InputAdornment>
                  }
                  value={memo}
                  onChange={handleMemoChange}
                />
              </FormControl>
            </div>

            <img className="image" src={fileString}></img>
          </Box>
        </ThemeProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          取消
        </Button>
        <Button onClick={handleSubmit} color="primary">
          確定修改
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
