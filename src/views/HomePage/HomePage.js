import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./HomePage.css";
import MainContent from './components/MainContent';
import { useHistory } from "react-router-dom";
import { getAllMenu } from "../../store/menu-actions";
import SaleSvg from '../../shared/style/image/sale.png';

const HomePage = () => {

	const token = useSelector((state) => state.ui.token);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(getAllMenu(token, history));
	}, []);
	
	return (
		<div className="common-page">
			<header className="home-header">
				<MainContent></MainContent>
				{/* <img className="image" src={SaleSvg}></img> */}
			</header>
		</div>
	);
};

export default HomePage;
