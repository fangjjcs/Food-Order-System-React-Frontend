
import { useHistory } from "react-router-dom";
import { useState } from "react";

import { Box, Button, FormHelperText, Input, InputAdornment, MenuItem, Select } from '@mui/material';
import { Restaurant, Fastfood, Info } from "@mui/icons-material";

import './MainContent.css';
import { useHttpClient } from "../../../shared/hook/http-hook";
import FoodSvg from '../../../shared/style/image/food.png';
import FormInput from "../../../shared/components/forms/FormInput";
import { useSelector } from "react-redux";

const MainContent = () => {
  
	const [img, setImg] = useState(null);
	const [fileString, setFileString] = useState("");

	const [storeName, setStoreName] = useState("");
	const [type, setType] = useState("food");
	const [memo, setMemo] = useState("");
	const [isError, setIsError] = useState(false);
	const { isLoading, error, sendRequest } = useHttpClient();
	const history = useHistory()

	const token = useSelector((state) => state.ui.token);
	const header = new Headers()
	header.append("Content-Type", "application/json")
	header.append("Authorization", "Bearer " + token)
  
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
		return(
			<Box className="content-box">
				<div className="upload-content">
					<label htmlFor="contained-button-file">
						<Button variant="contained" size="small" className="upload-btn" component="span">上傳菜單</Button>
						{(isError && fileString === "") && <FormHelperText error>沒菜單怎麼點餐ＱＱ</FormHelperText>}
					</label>
					<input
						accept="image/*"
						className="disabled-btn"
						id="contained-button-file"
						multiple
						type="file"
						onChange={handleImgChange}
					/>
					<FormInput formClass="login-form" label="店家名稱">
						<Input
							id="input-with-icon-adornment"
							style={{color:"#666"}}
							startAdornment={
								<InputAdornment position="start">
								<Restaurant style={{fill:"#255957"}}/>
								</InputAdornment>
							}
							value={storeName}
							onChange={handleNameChange}
						/>
						{(isError && storeName === "") && <FormHelperText error>必填</FormHelperText>}
					</FormInput>
					<FormInput formClass="login-form" label="類型">
						<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								style={{color:"#666"}}
								startAdornment={
									<InputAdornment position="start">
									<Fastfood style={{fill:"#255957"}}/>
									</InputAdornment>
								}
								value={type}
								onChange={handleTypeChange}
							>
								<MenuItem value={"food"}>食物</MenuItem>
								<MenuItem value={"drink"}>飲料</MenuItem>
						</Select>
					</FormInput>
					<FormInput formClass="login-form" label="其他資訊">
						<Input
							id="input-with-icon-adornment"
							style={{color:"#666"}}
							startAdornment={
								<InputAdornment position="start">
								<Info style={{fill:"#255957"}}/>
								</InputAdornment>
							}
							value={memo}
							onChange={handleMemoChange}
							placeholder={"例如:電話"}
						/>
					</FormInput>
					<div className="login-form btn-box">
						<Button variant="contained" size="small" className="upload-btn" onClick={handleSubmit}>新增</Button>
					</div>
				</div>
				<img className="upload-image" src={img}></img>
				<img className="image" src={FoodSvg}></img>
			</Box>
		)
}

export default MainContent;