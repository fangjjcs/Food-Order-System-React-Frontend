import { ExposureRounded, Fastfood, FreeBreakfast, Help, MonetizationOn } from "@material-ui/icons";
import { Button, FormControl, FormHelperText, Input, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hook/http-hook";

import './OrderDialogContent.css';

const OrderDialogContent = ({user, item, onCloseDialog}) => {

    const [isError, setIsError] = useState(false);
    const { isLoading, error, sendRequest } = useHttpClient();
    const history = useHistory();

    const token = useSelector((state) => state.ui.token);
    const header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", "Bearer " + token);

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
        menuId: parseInt(item.id),
        name: item.name,
        type: item.type,
        item: itemName,
        sugar: item.type === "drink" ? itemSugar : "",
        ice: item.type === "drink" ? itemIce : "",
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
    
            console.log("[ADD ORDER RESPONSE]",responseData);
            if (responseData.status === 403) {
                history.replace("/login")
            } else if (responseData.status === 200) {
                onCloseDialog();
                window.location.reload();
            }
        } catch (err) {
            // done in http-hook.js
        }
        };
        fetchData();
    };


    return(
        <div className="order-dialog-box">
            <div className="order-content">
              <div className="menu-name">
                 <div className="memo">結單時間：{item.closeAt}</div>
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
                  <FormHelperText error>必填</FormHelperText>
                )}
              </FormControl>
              {item.type === "drink" && (
                <>
                  <FormControl variant="standard" className="login-form">
                    <InputLabel htmlFor="input-with-icon-adornment">
                      糖度
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      startAdornment={
                        <InputAdornment position="start">
                          <FreeBreakfast style={{ color: "#005566" }} />
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
                          <FreeBreakfast style={{ color: "#005566" }} />
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
                </>
              )}
              <FormControl variant="standard" className="login-form">
                <InputLabel htmlFor="input-with-icon-adornment">
                  數量
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <ExposureRounded style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={count}
                  onChange={handleItemCountChange}
                />
                {isError && count === "" && (
                  <FormHelperText error>必填</FormHelperText>
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
                      <MonetizationOn style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={price}
                  onChange={handleItemPriceChange}
                />
                {isError && price === "" && (
                  <FormHelperText error>必填</FormHelperText>
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
                      <Help style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={userMemo}
                  onChange={handleUserMemoChange}
                />
              </FormControl>

              <div className="login-form btn-box">
                <Button variant="contained" onClick={handleSubmit} className="btn" >
                  送出
                </Button>
              </div>
            </div>
            <img className="image" src={item.fileString}></img>
        </div>
    )
}

export default OrderDialogContent;