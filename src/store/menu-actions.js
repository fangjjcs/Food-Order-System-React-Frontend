import { menuActions } from "./menu-slice";

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
      console.log("[ALL MENU] ", data);
      dispatch(menuActions.setFood(data.menu.filter((item) => item.type === "food")));
      dispatch(menuActions.setDrink(data.menu.filter((item) => item.type === "drink")));
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
      console.log("[OPENED MENU] ", data);
      if (data.menu !== null) {
        dispatch(menuActions.setTodayMenu(data.menu));
        dispatch(menuActions.setLoadingComplete());
      }
    } catch (err) {
      //
    }
  };
};


export const openMenu = (header, history, request) => {
  console.log("[OPEN MENU REQUEST]", request)
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
      const data = await responseData.json();
      if (data.status === 403) {
        history.replace("/login");
      } else if (data.status === 200) {
        console.log("[OPEN MENU]",data)
      }
    };
    try {
      const data = await fetchData();
    } catch (err) {
    }
  };
};

export const setFilter = (text) => {
	return async (dispatch) => {
		dispatch(menuActions.setFilter(text));
	}
}

export const updateMenuRating = (header, history, request) => {
  console.log("[UPDATE MENU RATING REQUEST]", request)
  return async (dispatch) => {
    const fetchData = async () => {
      const responseData = await fetch(
        `${process.env.REACT_APP_API_URL}/update-rating`,
        {
          method: "POST",
          body: JSON.stringify(request),
          header: header,
        }
      );
      const data = await responseData.json();
      if (data.status === 403) {
        history.replace("/login");
      } else if (data.status === 200) {
        console.log("[UPDATE MENU RATING]",data)
      }
    };
    try {
      const data = await fetchData();
    } catch (err) {
    }
  };
};

export const setRandomChoice = (menu) => {
	return async (dispatch) => {
		dispatch(menuActions.setRandomChoice(menu));
	}
}

export const setDisableRandomChoose = () => {
	return async (dispatch) => {
		dispatch(menuActions.setDisableRandomChoose());
	}
}