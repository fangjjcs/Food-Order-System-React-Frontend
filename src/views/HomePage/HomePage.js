import { Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import "./HomePage.css";
import FoodPaper from "./components/FoodPaper";
import MenuItemList from "./components/MenuItemList";
import OrderItemList from "./components/OrderItemList";
import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";
import SnackBar from "./components/SnackBar";
import { getAllMenu, getOpenedMenu } from "../../store/menu-actions";

const HomePage = () => {
  const [isSnackBarOpen, setSnackBarOpen] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const food = useSelector((state) => state.menu.food);
  const drink = useSelector((state) => state.menu.drink);
  const todayMenu = useSelector((state) => state.menu.todayMenu);
  const isLoading = useSelector((state) => state.menu.isLoading);

  const authContext = useContext(AuthContext);
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  useEffect(() => {
    dispatch(getAllMenu(header, history));
    dispatch(getOpenedMenu(header, history));
    checkSnackBar();
  }, []);

  const checkSnackBar = () => {
    if (authContext.isSuccess) {
      setSnackBarOpen(true);
    }
    setTimeout(() => {
      setSnackBarOpen(false);
      authContext.setSuccess("");
    }, 3000);
  };

  return (
    <header className="home-page-header">
      <Box className="home-page-box">
        <Fragment>
            <FoodPaper type={"food"} width={36}>
              {food.length > 0 && <MenuItemList list={food}></MenuItemList>}
            </FoodPaper>
            <FoodPaper type={"drink"} width={36}>
              {drink.length > 0 && <MenuItemList list={drink}></MenuItemList>}
            </FoodPaper>
            <FoodPaper type={"order"} width={72}>
              {todayMenu.length > 0 && (
                <OrderItemList list={todayMenu}></OrderItemList>
              )}
            </FoodPaper>
          </Fragment>
        
      </Box>
      <SnackBar
        isOpen={isSnackBarOpen}
        text={authContext.successText}
      ></SnackBar>
    </header>
  );
};

export default HomePage;
