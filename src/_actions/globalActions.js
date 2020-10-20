import types from "./types";
import { ispService } from "@/_services";
import userActions from "@/_actions/userActions";

const globalActions = {
  changeLanguage: (data) => {
    return {
      type: types.CHANGE_LANGUAGE,
      payload: data,
    };
  },
  fillLanguages: (data) => {
    return {
      type: types.FILL_LANGUAGES,
      payload: data,
    };
  },
  shouldLoad: (data) => {
    return {
      type: types.LOADING,
      payload: data,
    };
  },
  loadInternetUser: (data) => {
    console.log(data);
    return {
      type: types.LOAD_INTERNET_USER,
      payload: data,
    };
  },
  loadInternetUserAccounts: (data) => {
    console.log("load internet users");
    console.log(data);
    return {
      type: types.LOAD_INTERNET_USER_ACCOUNTS,
      payload: data,
    };
  },
  loadPackages: (data) => {
    console.log("load packages");
    return {
      type: types.LOAD_PACKAGES,
      payload: data,
    };
  },
  fetchInternetUsers: () => {
    return async (dispatch, getState) => {
      try {
        dispatch(globalActions.shouldLoad(true));
        const data = await ispService.getAllUsers();
        console.log(data);
        dispatch(globalActions.loadInternetUser(data));
        dispatch(globalActions.shouldLoad(false));
      } catch (err) {
        if (err === 403) {
          dispatch(userActions.logout());
        }
      }
    };
  },
  fetchInternetUserAccounts: () => {
    return async (dispatch, getState) => {
      const data = await ispService.getAllUserAccounts();
      console.log(data);
      return dispatch(globalActions.loadInternetUserAccounts(data));
    };
  },
  updateUserAcc: (id, userAcc) => {
    return async (dispatch, getState) => {
      console.log(id);
      const data = await ispService.updateUserAcc(id, userAcc);
      console.log(data);
      dispatch(globalActions.fetchInternetUserAccounts());
    };
  },
  deleteUserAcc: (id, userAcc) => {
    return async (dispatch, getState) => {
      console.log(id);
      const data = await ispService.deleteUserAcc(id);
      console.log(data);
      dispatch(globalActions.fetchInternetUserAccounts());
    };
  },
  searchForUser: (term) => {
    return async (dispatch, getState) => {
      console.log(term);
      const data = getState().isp.userAccounts.filter((userAcc) => {
        console.log(userAcc);
        return userAcc.user.firstName.toLowerCase().indexOf(term) != -1;
      });
      console.log(`datareturned: ${data}`);
      return dispatch(globalActions.loadInternetUserAccounts(data));
    };
  },
};

export { globalActions };
