import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    food: [],
    drink: [],
    filteredFood: [],
    filteredDrink: [],
    todayMenu: [],
    randomChoiceMenu: {},
    isRandomChoose: false,
    isLoading: false,
    isFiltering: false,
    initialized: false
  },
  reducers: {
    setFood(state, action) {
      state.food = action.payload;
      state.filteredFood = action.payload;
      state.initialized = true;
    },
    setDrink(state, action) {
      state.drink = action.payload;
      state.filteredDrink = action.payload;
      state.initialized = true;
    },
    setFilter(state, action) {
      const filterText = action.payload;
      if(filterText===""){
        state.filteredFood = state.food;
        state.filteredDrink = state.drink;
        state.isFiltering = false;
        return
      }
      state.filteredFood = state.food.filter( f => f.name.toLowerCase().includes(filterText));
      state.filteredDrink = state.drink.filter( d => d.name.toLowerCase().includes(filterText));
      state.isFiltering = true;
    },
    setReset(state, action) {
      state.filteredFood = state.food;
      state.filteredDrink = state.drink;
      state.isFiltering = false;
    },
    setTodayMenu(state, action) {
      state.todayMenu = action.payload;
    },
    setIsLoading(state) {
      state.isLoading = true
    },
    setLoadingComplete(state) {
        state.isLoading = false
    },
    setRandomChoice(state, action) {
      state.randomChoiceMenu = action.payload;
      state.isRandomChoose = true;
    },
    setDisableRandomChoose(state) {
      state.isRandomChoose = false;
    },
  },
});

export const menuActions = menuSlice.actions;

export default menuSlice;
