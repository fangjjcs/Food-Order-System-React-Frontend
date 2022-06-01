import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import AuthContext from "../../context/auth-context";

const NavLinks = (props) => {
  const authContext = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          開始點餐
        </NavLink>
      </li>
      {authContext.isLogin && (
        <>
          <li>
            <NavLink to="/create">新增菜單</NavLink>
          </li>
          <li>
            <NavLink to="/result">點餐狀態</NavLink>
          </li>
          <li>
            <NavLink to="/admin">菜單管理</NavLink>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
