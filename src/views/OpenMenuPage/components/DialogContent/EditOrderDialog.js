import React, { useState} from 'react';
import { useHistory } from 'react-router-dom';

import './EditOrderDialog.css';
import { useHttpClient } from '../../../../shared/hook/http-hook';
import { Button, Select, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Input, InputAdornment, InputLabel, MenuItem } from '@mui/material';
import { ExposureRounded, Fastfood, FreeBreakfast, Help, MonetizationOn } from '@material-ui/icons';
import { useSelector } from 'react-redux';

const EditOrderDialog = (props) => {

    const [isError, setIsError] = useState(false);

    const id = props.data.id;
    const user = props.data.user;
    const menuId = props.data.menuId;
    const menuName = props.data.name;
    const type = props.data.type;
    const memo = props.data.memo;

    const [itemName, setItemName] = useState(props.data.item);
    const [itemSugar, setItemSugar] = useState(props.data.sugar?props.data.sugar:"");
    const [itemIce, setItemIce] = useState(props.data.ice?props.data.ice:"");
    const [price, setItemPrice] = useState(props.data.price);
    const [userMemo, setUserMemo] = useState(memo);
    const [count, setItemCount] = useState(props.data.count);

    const history = useHistory();
    const { isLoading, error, sendRequest } = useHttpClient();

    const token = useSelector((state) => state.ui.token);
    const header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", "Bearer " + token);

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
            id: id,
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
          createPost(request);
        }
    };

    const createPost = (request) => {
			const fetchData = async () => {
				try {
					const responseData = await sendRequest(
						process.env.REACT_APP_API_URL+"/update-order",
						"POST",
						JSON.stringify(request),
						header
					);
			
					if (responseData.status === 403) {
						history.replace("/login")
					} else if (responseData.status === 200) {
						// authContext.setSuccess("成功修改餐點!")
						props.onClickCancel()
						window.location.reload();
					}
				} catch (err) {
					// done in http-hook.js
				}
			};
			fetchData();
      };

    const handleClose = () => {
        props.onClickCancel()
    }
    return(
        <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth={true}>
            <DialogTitle id="form-dialog-title">{user} 修改訂單 : {menuName}</DialogTitle>
            <DialogContent className="edit-order-dialog-box">
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
                      <MonetizationOn style={{ color: "#005566" }} />
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
                      <Help style={{ color: "#005566" }} />
                    </InputAdornment>
                  }
                  value={userMemo}
                  onChange={handleUserMemoChange}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant="text" size="small" className="btn">
                取消
            </Button>
            <Button onClick={handleSubmit} variant="contained" size="small" className="btn">
                確定修改
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditOrderDialog;
