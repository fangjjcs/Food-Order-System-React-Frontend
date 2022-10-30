import React, {  useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Box, FormControl, InputLabel, Input, InputAdornment, FormHelperText, MenuItem, Select, Button } from "@material-ui/core";
import { Restaurant, Fastfood, Info } from "@material-ui/icons";

import "./EditDialog.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHttpClient } from "../../../../shared/hook/http-hook";

const EditDialog = ({isOpen, onEditDialogClose, item}) => {
	const [isError, setIsError] = useState(false);

	const id = item.id;
	const [menuName, setMenuName] = useState(item.name);
	const [type, setType] = useState(item.type);
	const [fileString, setFileString] = useState(item.fileString);
	const [memo, setMemo] = useState(item.memo);

	const history = useHistory();
	const { isLoading, error, sendRequest } = useHttpClient();
	
	const token = useSelector((state) => state.ui.token);
	const header = new Headers();
	header.append("Content-Type", "application/json");
	header.append("Authorization", "Bearer " + token);

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
		}
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
			history.replace("/login");
			} else if (responseData.status === 200) {
			console.log(responseData);
			onEditDialogClose();
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
		onEditDialogClose();
	};

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
			maxWidth="md"
			fullWidth={true}
		>
		<DialogTitle id="form-dialog-title">修改菜單 : </DialogTitle>
		<div className="edit-dialog-content">
			<div className="upload-content">
			<label htmlFor="contained-button-file">
				<Button variant="contained" size="small" className="btn"component="span">
				上傳照片
				</Button>
			</label>
			<input
				accept="image/*"
				className="disabled-btn"
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
					<Restaurant style={{ color: "#005566" }} />
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
					<Fastfood style={{ color: "#005566" }} />
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
					<Info style={{ color: "#005566" }} />
					</InputAdornment>
				}
				value={memo}
				onChange={handleMemoChange}
				/>
			</FormControl>
			</div>
			<img className="image" src={fileString}></img>
		</div>
		<DialogActions>
			<Button onClick={handleClose} variant="contained" size="small" className="btn">取消</Button>
			<Button onClick={handleSubmit} variant="contained" size="small" className="btn">確定修改</Button>
		</DialogActions>
		</Dialog>
	);
};

export default EditDialog;
