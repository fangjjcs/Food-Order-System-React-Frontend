import { menuActions } from "./menu-slice";
import { uiActions } from "./ui-slice";


export const getAllMenu = (token, history) => {
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + token);

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

export const getOpenedMenu = (token, history) => {

  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + token);

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
export const openMenu = (token, history, request) => {

  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + token);

  return async (dispatch) => {
    const fetchData = async () => {
      const responseData = await fetch(
        `${process.env.REACT_APP_API_URL}/update-open`,
        {
          method: "POST",
          body: JSON.stringify(request),
          header: header,
        }
      );
      if (responseData.status === 403) {
        history.replace("/login");
      } else if (responseData.status === 200) {
        const data = await responseData.json();
        return data;
      }
    };
    try {
      const data = await fetchData();
      getOpenedMenu(token, history);
      
    } catch (err) {
      //
    }
  };
};
