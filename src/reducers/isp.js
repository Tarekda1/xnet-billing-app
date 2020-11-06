import types from '@/_actions/types';

const initialState = {
	users: [],
	packages: [],
	userAccounts: {},
	tempUserAccount: []
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
		case types.LOAD_INTERNET_USER_ACCOUNTS:
			return { ...state, userAccounts: payload };
		default:
			return state;
	}
};
