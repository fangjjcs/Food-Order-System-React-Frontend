import { configureStore } from "@reduxjs/toolkit";

import menuSlice from "./menu-slice";

const store = configureStore({
    reducer: {
        menu: menuSlice.reducer,
    }
})

export default store;