import {
  Box,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Button,
  MenuItem,
  Select,
  FormHelperText,
} from "@material-ui/core";
import { Restaurant, Fastfood, Info } from "@material-ui/icons";
import { useState, useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import "./CreatePage.css";
import { useHttpClient } from "../../shared/hook/http-hook";
import { useHistory } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";

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

const CreatePage = (props) => {
  const [img, setImg] = useState(null);
  const [fileString, setFileString] = useState("");

  const [storeName, setStoreName] = useState("");
  const [type, setType] = useState("food");
  const [memo, setMemo] = useState("");
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest } = useHttpClient();
  const history = useHistory()

  const authContext = useContext(AuthContext)
  const header = new Headers()
  header.append("Content-Type", "application/json")
  header.append("Authorization", "Bearer " + authContext.token)

  useEffect(() => {
    if(!authContext.isLogin) {
        history.replace("/login")
    }
}, [])

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    setImg(URL.createObjectURL(file));
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setFileString(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (event) => {
    setStoreName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  const checkEmpty = () => {
    if ( storeName === "" || type === "" || fileString === "" ) {
      setIsError(true)
      return false
    }
    return true
  }

  const handleSubmit = () => {
    const checkPass = checkEmpty()
    const request = {
      name: storeName,
      type: type,
      memo: memo,
      fileString: fileString
    }
    console.log(request)
    if(checkPass) {
      createPost(request)
    }
  };

  const createPost = (request) => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/create",
          "POST",
          JSON.stringify(request),
          header
        );

        console.log(responseData);
        if (responseData.status === 403) {
          history.replace("/login")
        } else if (responseData.status === 200) {
          history.replace("/")
        } 
      
      } catch (err) {
        // done in http-hook.js
      }
    };
    fetchData();
  };

  return (
    <div>
      <header className="movies-page-header">
        <ThemeProvider theme={theme}>
          <Box className="movies-page-box">
            <div className="upload-content">
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  上傳照片
                </Button>
                {(isError && fileString === "") && (
                  <FormHelperText error>Can not be empty</FormHelperText>
                )}
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
                  value={storeName}
                  onChange={handleNameChange}
                />
                {(isError && storeName === "") && (
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
                  placeholder={"例如:電話"}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                新增菜單
              </Button>
            </div>

            <img className="image" src={img}></img>
          </Box>
        </ThemeProvider>
      </header>
    </div>
  );
};

export default CreatePage;