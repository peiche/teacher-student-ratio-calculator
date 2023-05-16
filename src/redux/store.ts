import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import groupsReducer from './slices/groupsSlice';
import colorModeReducer from "./slices/colorModeSlice";
import orderReducer from './slices/orderSlice';
import orderByReducer from './slices/orderBySlice';
import rowsPerPageReducer from './slices/rowsPerPageSlice';

const rootReducer = combineReducers({
	groups: groupsReducer,
	colorMode: colorModeReducer,
	order: orderReducer,
	orderBy: orderByReducer,
	rowsPerPage: rowsPerPageReducer,
});

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
