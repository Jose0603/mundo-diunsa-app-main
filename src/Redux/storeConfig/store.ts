import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import JSOG from 'jsog';
import { persistReducer, persistStore } from 'redux-persist';
import { createTransform } from 'redux-persist';
import thunk from 'redux-thunk';

import { applyMiddleware, compose, createStore } from 'redux';

import signalRMiddleware from '../middlewares/signalRMiddleware';
import rootReducer from '../reducers/rootReducer';

export const JSOGTransform = createTransform(
  (inboundState, key) => JSOG.encode(inboundState),
  (outboundState, key) => JSOG.decode(outboundState)
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [JSOGTransform],
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk];
const composeEnhancers = compose;
// const store = createStore(persistedReducer, {}, composeEnhancers(applyMiddleware(...middlewares)));

const store = configureStore({
  reducer: persistedReducer,
  middleware: middlewares,
});

const persistor = persistStore(store);
export { store, persistor };
