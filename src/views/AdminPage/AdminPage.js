import { Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import "./AdminPage.css";
import FoodPaper from "./components/FoodPaper";
import MenuItemList from "./components/MenuItemList";
import OrderItemList from "./components/OrderItemList";
import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";
import { getAllMenu, getOpenedMenu } from "../../store/menu-actions";

const AdminPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const food = useSelector((state) => state.menu.food);
  const drink = useSelector((state) => state.menu.drink);
  const todayMenu = useSelector((state) => state.menu.todayMenu);
  const initialized = useSelector((state) => state.menu.initialized);

  const authContext = useContext(AuthContext);
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  useEffect(() => {
    if (!authContext.isLogin) {
      history.replace("/login");
    }
    if (!initialized) {
      dispatch(getAllMenu(header, history));
      dispatch(getOpenedMenu(header, history));
    }
  }, []);

  return (
    <header className="admin-page-header">
      <Box className="admin-page-box">
        <FoodPaper type={"food"} width={30}>
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
    </header>
  );
};

export default AdminPage;
