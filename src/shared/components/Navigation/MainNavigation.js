import React, { useState, useContext } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from "../Backdrop/Backdrop";
import Footer from "../Footer/Footer";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

    return (
		<React.Fragment>
			<MainHeader>
				<h2 className="main-navigation__title">
					<Link to="/">{props.config.headerName}</Link>
				</h2>
				<nav className="main-navigation__header-nav-auth">
					<NavLinks />
				</nav>
			</MainHeader>
		</React.Fragment>
    );
};

export default MainNavigation;
