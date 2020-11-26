import { combineReducers } from "redux";
import user from "./user";
import global from "./global";
import isp from "./isp";

const appReducer = combineReducers({
  user,
  global,
  isp,
});

export default (state, action) => {
  if (action.type === "PERFORM_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};
