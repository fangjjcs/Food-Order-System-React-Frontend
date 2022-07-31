import { configureStore } from "@reduxjs/toolkit";

import menuSlice from "./menu-slice";
import uiSlice from "./ui-slice";

const store = configureStore({
    reducer: {
        menu: menuSlice.reducer,
        ui: uiSlice.reducer
    }
})

export default store;