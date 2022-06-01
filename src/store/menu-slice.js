import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    food: [],
    drink: [],
    todayMenu: [],
    isLoading: false,
    initialized: false
  },
  reducers: {
    setFood(state, action) {
      state.food = action.payload;
      state.initialized = true;
    },
    setDrink(state, action) {
      state.drink = action.payload;
      state.initialized = true;
    },
    setTodayMenu(state, action) {
      state.todayMenu = action.payload;
    },
    setIsLoading(state) {
      state.isLoading = true
    },
    setLoadingComplete(state) {
        state.isLoading = false
      }
  },
});

export const menuActions = menuSlice.actions;

export default menuSlice;
