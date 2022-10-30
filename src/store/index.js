import { configureStore } from "@reduxjs/toolkit";
import editSlice from "./edit-slice";
import menuSlice from "./menu-slice";
import uiSlice from "./ui-slice";

const store = configureStore({
    reducer: {
        menu: menuSlice.reducer,
        ui: uiSlice.reducer,
        edit: editSlice.reducer
    }
})

export default store;