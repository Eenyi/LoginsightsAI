import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
const initialState = {
    currentScreen: "login",
    loggedUser: ""
};
const LogInsightsAIMenuSlice = createSlice({
    name: "LogInsightsAIMenu",
    initialState,
    reducers: {
        setCurrentScreen: (state, action) => {
            state.currentScreen = action.payload;
        },
        setLoggedUser: (state, action) => {
            state.loggedUser = action.payload;
        },
    },
});
export const {
    setCurrentScreen,
    setLoggedUser,
} = LogInsightsAIMenuSlice.actions;
const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, LogInsightsAIMenuSlice.reducer);
const store = configureStore({
    reducer: persistedReducer,
});
const persistor = persistStore(store);
export { store as default, persistor };
