import types from '../actions/types.js';

const initialState = {
	internetUsers: [],
	packages: []
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case types.LOAD_INTERNET_USERS:
			return { ...state, internetUsers: [] };
		case types.LOAD_PACKAGES:
			return { ...state, packages: [] };
		default:
			return state;
	}
};
