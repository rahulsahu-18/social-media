import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from './postSlice.js';
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js";
import rtnSlice from "./rtnSlice.js";

import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
// Use localStorage in browser, no-op storage in non-browser (SSR/test)
// Always use direct import for browser, fallback to noop for non-browser
// Custom storage to ensure getItem/setItem are always functions
const noopStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
};

const storage = (typeof window !== 'undefined' && window.localStorage)
    ? {
            getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
            setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
            removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
        }
    : noopStorage;


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    realTimeNotification:rtnSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;