import { uiActions } from "./ui-slice";

export const getUser = (history, userName, getUserURL) => {

	return async (dispatch) => {
		const login = async () => {
			const responseData = await fetch( getUserURL, {
				method: "POST",
				body: JSON.stringify({userName: userName}),
				header: {},
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
			dispatch(uiActions.setIsLoading(true));
			const data = await login();
			if (data.status !== 200) {
				dispatch(uiActions.setIsError(true));
				dispatch(uiActions.setErrorMsg(data.error.message));
			} else {
				dispatch(uiActions.setIsError(false));
				dispatch(uiActions.setErrorMsg(""));
				console.log("[ Login User ] : ", data);
				dispatch(uiActions.setLogin({token: data.response.jwt, userName: data.response.username}));
				dispatch(uiActions.setSnackMsg("成功登入!"));
				history.replace("/");
			}
		} catch (err) {
			alert(err.message);
			dispatch(uiActions.setIsError(true));
		}
	};
};

export const logout = () => {
	return async (dispatch) => {
		dispatch(uiActions.setLogout());
	}
}

export const setSnackMsg = (msg) => {
	return async (dispatch) => {
		dispatch(uiActions.setSnackMsg(msg));
	}
}