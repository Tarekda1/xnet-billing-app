import types from '../actions/types.js';

const initialState = {
	token: '',
	userInfo: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case types.SUCCESSFUL_LOGIN:
			const { token, ...userInfo } = payload;
			localStorage.setItem('token', token);
			return { ...state, token: token, userInfo: userInfo.info };
		case types.PERFORM_LOGOUT:
			localStorage.removeItem('token');
			return {
				token: '',
				userInfo: {}
			};
		case types.UPDATE_PROFILE:
			return { ...state, userInfo: payload };
		default:
			return state;
	}
};
