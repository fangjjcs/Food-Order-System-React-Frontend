import { menuActions } from "./menu-slice";

export const getAllMenu = (header, history) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const responseData = await fetch(`${process.env.REACT_APP_API_URL}/get-all-menu`, {
        method: "POST",
        body: JSON.stringify({}),
        header: header,
      });
      if (responseData.status === 403) {
        history.logout();
        history.replace("/login");
      } else if (responseData.status === 200) {
        const data = await responseData.json();
        return data;
      }
    };
    try {
      dispatch(menuActions.setIsLoading());
      const data = await fetchData();
      dispatch(
        menuActions.setFood(data.menu.filter((item) => item.type === "food"))
      );
      dispatch(
        menuActions.setDrink(data.menu.filter((item) => item.type === "drink"))
      );
      dispatch(menuActions.setLoadingComplete());
    } catch (err) {
      //
    }
  };
};

export const getOpenedMenu = (header, history) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const responseData = await fetch(
        `${process.env.REACT_APP_API_URL}/get-opened-menu`,
        {
          method: "POST",
          body: JSON.stringify({}),
          header: header,
        }
      );
      if (responseData.status === 403) {
        history.logout();
        history.replace("/login");
      } else if (responseData.status === 200) {
        const data = await responseData.json();
        return data;
      }
    };
    try {
      dispatch(menuActions.setIsLoading());
      const data = await fetchData();
      if (data.menu !== null) {
        dispatch(menuActions.setTodayMenu(data.menu));
        dispatch(menuActions.setLoadingComplete());
      }
    } catch (err) {
      //
    }
  };
};
