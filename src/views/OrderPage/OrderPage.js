import { useLocation } from "react-router-dom";
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
import { useState, useContext, useEffect, Fragment } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import HelpIcon from "@material-ui/icons/Help";
import ExposureRoundedIcon from '@material-ui/icons/ExposureRounded';
import Fastfood from "@material-ui/icons/Fastfood";

import "./OrderPage.css";
import { useHttpClient } from "../../shared/hook/http-hook";
import { useHistory } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";
import { useParams } from "react-router-dom";

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

const OrderPage = (props) => {
  
  useEffect(() => {
    if (!authContext.isLogin) {
      history.replace("/login");
    }
  }, []);

  const location = useLocation();
  const paras = useParams();
  const history = useHistory();

  if (location.item) {
    localStorage.setItem("id", location.item.id);
    localStorage.setItem("name", location.item.name);
    localStorage.setItem("fileString", location.item.fileString);
    localStorage.setItem("type", location.item.type);
    localStorage.setItem("memo", location.item.memo);
  } else {
    if (paras.id !== localStorage.getItem("id")) {
      history.push("/");
    }
  }

  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest } = useHttpClient();
  const authContext = useContext(AuthContext);
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  const user = authContext.user;
  const menuId = localStorage.getItem("id");
  const menuName = localStorage.getItem("name");
  const fileString = localStorage.getItem("fileString");
  const type = localStorage.getItem("type");
  const memo = localStorage.getItem("memo");

  const [itemName, setItemName] = useState("");
  const [itemSugar, setItemSugar] = useState("無糖");
  const [itemIce, setItemIce] = useState("去冰");
  const [price, setItemPrice] = useState("");
  const [userMemo, setUserMemo] = useState("");
  const [count, setItemCount] = useState("1");

  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  };
  const handleItemIceChange = (event) => {
    setItemIce(event.target.value);
  };
  const handleItemSugarChange = (event) => {
    setItemSugar(event.target.value);
  };

  const handleItemPriceChange = (event) => {
    setItemPrice(event.target.value);
  };

  const handleUserMemoChange = (event) => {
    setUserMemo(event.target.value);
  };

  const handleItemCountChange = (event) => {
    setItemCount(event.target.value);
  };

  const checkEmpty = () => {
    if (itemName === "" || price === "" || count === "") {
      setIsError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const checkPass = checkEmpty();
    const request = {
      menuId: parseInt(menuId),
      name: menuName,
      type: type,
      item: itemName,
      sugar: type === "drink" ? itemSugar : "",
      ice: type === "drink" ? itemIce : "",
      price: price,
      memo: userMemo,
      user: user,
      count: count,
    };
    if (checkPass) {
      console.log(request);
      createPost(request);
    }
  };

  const createPost = (request) => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/add-order",
          "POST",
          JSON.stringify(request),
          header
        );

        console.log(responseData);
        if (responseData.status === 403) {
          authContext.logout()
          history.replace("/login")
        } else if (responseData.status === 200) {
          authContext.setSuccess("成功點餐!")
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
      <header className="order-page-header">
        <ThemeProvider theme={theme}>
          <Box className="order-page-box">
            <div className="order-content">
              <div className="memo">嗨，{user}，請開始點餐</div>
              <div className="menu-name">
                {menuName}
                {memo && <div className="memo">{memo}</div>}
              </div>

              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  品項名稱
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <Fastfood style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={itemName}
                  onChange={handleItemNameChange}
                />
                {isError && itemName === "" && (
                  <FormHelperText error>Can not be empty</FormHelperText>
                )}
              </FormControl>
              {type === "drink" && (
                <Fragment>
                  <FormControl variant="standard" className="login-form">
                    <InputLabel htmlFor="input-with-icon-adornment">
                      糖度
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      startAdornment={
                        <InputAdornment position="start">
                          <FreeBreakfastIcon style={{ color: "#005566" }} />
                        </InputAdornment>
                      }
                      value={itemSugar}
                      onChange={handleItemSugarChange}
                    >
                      <MenuItem value={"無糖"}>無糖</MenuItem>
                      <MenuItem value={"一分糖"}>一分糖</MenuItem>
                      <MenuItem value={"微糖"}>微糖</MenuItem>
                      <MenuItem value={"半糖"}>半糖</MenuItem>
                      <MenuItem value={"少糖"}>少糖</MenuItem>
                      <MenuItem value={"全糖"}>全糖</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" className="login-form">
                    <InputLabel htmlFor="input-with-icon-adornment">
                      冰塊
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      startAdornment={
                        <InputAdornment position="start">
                          <FreeBreakfastIcon style={{ color: "#005566" }} />
                        </InputAdornment>
                      }
                      value={itemIce}
                      onChange={handleItemIceChange}
                    >
                      <MenuItem value={"熱"}>熱</MenuItem>
                      <MenuItem value={"去冰"}>去冰</MenuItem>
                      <MenuItem value={"微冰"}>微冰</MenuItem>
                      <MenuItem value={"少冰"}>少冰</MenuItem>
                      <MenuItem value={"正常冰"}>正常冰</MenuItem>
                    </Select>
                  </FormControl>
                </Fragment>
              )}
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  數量
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <ExposureRoundedIcon style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={count}
                  onChange={handleItemCountChange}
                />
                {isError && count === "" && (
                  <FormHelperText error>Can not be empty</FormHelperText>
                )}
              </FormControl>
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  價格
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <MonetizationOnIcon style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={price}
                  onChange={handleItemPriceChange}
                />
                {isError && price === "" && (
                  <FormHelperText error>Can not be empty</FormHelperText>
                )}
              </FormControl>
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  備註
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <HelpIcon style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={userMemo}
                  onChange={handleUserMemoChange}
                />
              </FormControl>

              <div className="login-form btn-box">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  確定
                </Button>
              </div>
            </div>

            <img className="image" src={fileString}></img>
          </Box>
        </ThemeProvider>
      </header>
    </div>
  );
};

export default OrderPage;
