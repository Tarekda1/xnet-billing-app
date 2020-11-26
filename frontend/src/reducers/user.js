import types from "@/_actions/types.js";

const initialState = {
  token: "",
  userInfo: {},
  needCheckUser: true,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SUCCESSFUL_LOGIN:
      const { token, ...userInfo } = payload;
      sessionStorage.setItem("token", token);
      return { ...state, token: token, userInfo: userInfo.info };
    case types.PERFORM_LOGOUT:
      sessionStorage.removeItem("token");
      return {
        token: "",
        userInfo: {},
        needCheckUser: false,
      };
    case types.UPDATE_PROFILE:
      return { ...state, userInfo: payload };
    default:
      return state;
  }
};
