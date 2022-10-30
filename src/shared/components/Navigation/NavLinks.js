import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./NavLinks.css";
import { useHistory } from "react-router-dom";
import { logout } from "../../../store/ui-action";

const NavLinks = (props) => {
  	const isLogin = useSelector((state) => state.ui.isLogin);
	const history = useHistory()
	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(logout());
		history.replace("/");
	};

	return (
		<ul className="nav-links">
			<li>
				<NavLink to="/" exact>首頁</NavLink>
			</li>
			{isLogin && (
				<>
					<li>
						<NavLink to="/today-menu">今日下午茶</NavLink>
					</li>
					<li>
						<NavLink to="/create">新增菜單</NavLink>
					</li>
					<li>
						<NavLink to="/admin">管理菜單</NavLink>
					</li>
				</>
			)}

			{isLogin ? (
				<div className="logout-btn" onClick={logoutHandler}> Logout </div> ) : (
				<li>
					<NavLink to="/login">Login</NavLink>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
