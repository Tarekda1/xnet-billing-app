import types from './types';

export default {
	changeLanguage: (data) => {
		return {
			type: types.CHANGE_LANGUAGE,
			payload: data
		};
	},
	fillLanguages: (data) => {
		return {
			type: types.FILL_LANGUAGES,
			payload: data
		};
	},
	shouldLoad: (data) => {
		return {
			type: types.LOADING,
			payload: data
		};
	},
	fillInternetUsers: (data) => {
		return {
			type: types.LOAD_INTERNET_USER,
			payload: data
		};
	},
	fillPackages: (data) => {
		return {
			type: types.LOAD_PACKAGES,
			payload: data
		};
	}
};
