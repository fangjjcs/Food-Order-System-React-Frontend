import { useState } from "react";
import { useHistory } from "react-router-dom/";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, Input, InputAdornment, InputLabel, Button, FormHelperText } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import "./LoginPage.css";
import { getUser } from "../../store/ui-action";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#005566",
      darker: "#005566",
    },
  },
});

const LoginPage = () => {

  const [username, setUsername] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  const getUserURL = process.env.REACT_APP_API_URL + "/v1/signin";
  const isError = useSelector( state => state.ui.isError);
  const errorMsg = useSelector( state => state.ui.errorMsg);

  const handleNameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(getUser(history, username, getUserURL)) ;
  };

  return (
    <header className="login-page-header">
      <ThemeProvider theme={theme}>
        <Box className="login-page-box">
          <FormControl variant="standard" className="login-form">
            <InputLabel htmlFor="input-with-icon-adornment">工號</InputLabel>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              value={username}
              onChange={handleNameChange}
            />
            {isError && (
              <FormHelperText error id="standard-helper-text">
                {errorMsg}
              </FormHelperText>
            )}
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            確認
          </Button>
        </Box>
      </ThemeProvider>
    </header>
  );
};

export default LoginPage;
