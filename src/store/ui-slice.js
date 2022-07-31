import { createSlice } from "@reduxjs/toolkit";

const initUser = localStorage.getItem("user");
const initToken = localStorage.getItem("token");
const initLonginStatus = !!initToken;

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        userName: initUser,
        token: initToken,
        isLogin: initLonginStatus,
        snackMsg: "",
        isError: false,
        errorMsg: "",
        isLoading: false
    },
    reducers: {
        setLogin(state, action) {
            state.token = action.payload.token;
            state.userName = action.payload.userName;
            localStorage.setItem("token", action.payload.token);
            state.isLogin = true;
        },
        setLogout(state, action) {
            state.token = "";
            state.userName = "";
            localStorage.removeItem("token")
            state.isLogin = false;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setIsError(state, action) {
            state.isError = action.payload;
        },
        setErrorMsg(state, action) {
            state.errorMsg = action.payload;
        },
        setSnackMsg(state, action) {
            state.snackMsg = action.payload;
        },
    },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
