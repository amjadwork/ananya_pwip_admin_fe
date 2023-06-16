import { connectRouter } from "connected-react-router";

import user from "./user";

const rootReducer = (history) => ({
  exportCosting: {},
  router: connectRouter(history),
  userData: user,
});

export default rootReducer;
