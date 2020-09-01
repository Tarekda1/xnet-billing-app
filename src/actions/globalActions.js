import types from "./types";
import { ispService } from "@/_services";

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
    console.log("load internet users");
    console.log(data);
    return {
      type: types.LOAD_INTERNET_USER,
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
      //fetch users
      // const data = [
      //   {
      //     id: "5f4e27e9436dc476f23ef202",
      //     firstName: "hani",
      //     lastName: "lad2i",
      //     phoneNumber: "03123456",
      //     address: "bshamoun al madaris al shady building",
      //     isActive: true,
      //     created: "2020-09-01T10:52:25.997Z",
      //     package: null,
      //   },
      // ];
      const data = await ispService.getAllUsers();
      console.log(data);
      return dispatch(globalActions.loadInternetUser(data));
    };
  },
};

export { globalActions };
