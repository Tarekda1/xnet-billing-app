import types from "@/actions/types";

const initialState = {
  users: [],
  packages: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  console.log(type);
  switch (type) {
    case types.LOAD_INTERNET_USER:
      console.log(`payload`);
      return { ...state, users: payload };
    case types.LOAD_PACKAGES:
      console.log(`payload`);
      return { ...state, packages: payload };
    default:
      return state;
  }
};
