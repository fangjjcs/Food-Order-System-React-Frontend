import React, { useState, useContext } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";

import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from "../Backdrop/Backdrop";
import Footer from "../Footer/Footer";

import AuthContext from "../../context/auth-context";
import { Box, Button } from "@material-ui/core";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const history = useHistory()
  const isLogin = authContext.isLogin;

  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  const logoutHandler = () => {
    authContext.logout();
    history.replace("/")
  };

  return (
    <React.Fragment>
      {drawerIsOpen ? <BackDrop onClick={closeDrawer} /> : null}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
          <Footer />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h2 className="main-navigation__title">
          <Link to="/">{props.config.headerName}</Link>
        </h2>
        <nav className="main-navigation__header-nav-auth">
          <ul className="nav-links">
            {isLogin ? (
                <div className="logout-btn" onClick={logoutHandler}>登出</div>
            ) : (
              <li>
                <NavLink to="/login">登入</NavLink>
              </li>
            )}
          </ul>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
