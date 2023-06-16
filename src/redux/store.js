import { configureStore } from "@reduxjs/toolkit";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createSagaMiddleware from "redux-saga";

import reducer from "./ducks/reducers";
import sagas from "./sagas";

export const history = createBrowserHistory();

const middleware = createSagaMiddleware();

const preloadedState = {};
export const store = configureStore({
  middleware: [middleware, routerMiddleware(history)],
  reducer: reducer(history),
  preloadedState,
});

middleware.run(sagas);
