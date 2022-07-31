import { Grid, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

import "./HomePage.css";
import FoodPaper from "./components/FoodPaper";
import MenuItemList from "./components/MenuItemList";
import OrderItemList from "./components/OrderItemList";
import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SnackBar from "./components/SnackBar";
import { getAllMenu, getOpenedMenu } from "../../store/menu-actions";
import { setSnackMsg } from '../../store/ui-action';

const useStyles = makeStyles((theme) => ({
	root: {
	  	flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
}));

const HomePage = () => {

	const classes = useStyles();

	const [isSnackBarOpen, setSnackBarOpen] = useState(false);

	const dispatch = useDispatch();
	const history = useHistory();

	const food = useSelector((state) => state.menu.food);
	const drink = useSelector((state) => state.menu.drink);
	const todayMenu = useSelector((state) => state.menu.todayMenu);
	const isLogin = useSelector((state) => state.ui.isLogin);
	const loginSnackMsg = useSelector((state) => state.ui.snackMsg);
	const token = useSelector((state) => state.ui.token);

	useEffect(() => {
		dispatch(getAllMenu(token, history));
		dispatch(getOpenedMenu(token, history));
		checkSnackBar();
	}, []);

	const checkSnackBar = () => {
		if (isLogin && loginSnackMsg) {
			setSnackBarOpen(true);
		}
		setTimeout(() => {
			setSnackBarOpen(false);
			dispatch(setSnackMsg(""));
		}, 3000);
	};

	return (
		<header className="home-page-header">
			<Box className="home-page-box">
				<FoodPaper type={"food"} width={30} >
					{food.length > 0 && <MenuItemList list={food}></MenuItemList>}
				</FoodPaper>
				<FoodPaper type={"drink"} width={30}>
					{drink.length > 0 && <MenuItemList list={drink}></MenuItemList>}
				</FoodPaper>
				<FoodPaper type={"order"} width={60}>
					{todayMenu.length > 0 && (
						<OrderItemList list={todayMenu}></OrderItemList>
					)}
				</FoodPaper>
			</Box>
			<SnackBar
				isOpen={isSnackBarOpen}
				text={loginSnackMsg}
			></SnackBar>
		</header>
	);
};

export default HomePage;
