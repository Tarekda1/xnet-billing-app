import types from '@/_actions/types.js';

const initialState = {
	language: 'en',
	showLoading: false,
	languages: [],
	showSearching: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case types.FILL_LANGUAGES:
			return { ...state, languages: payload };
		case types.LOADING:
			return { ...state, showLoading: payload };
		case types.SEARCHING:
			return { ...state, showSearching: payload };
		case types.CHANGE_LANGUAGE:
			return { ...state, language: payload };
		default:
			return state;
	}
};
