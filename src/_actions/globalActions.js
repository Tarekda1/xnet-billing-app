import types from './types';
import { ispService } from '@/_services';
import userActions from '@/_actions/userActions';
import { showNotification } from '@/_helpers';
import Pagged from '@/_helpers/pagged-class';

const globalActions = {
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
	showSearch: (data) => {
		return {
			type: types.SEARCHING,
			payload: data
		};
	},
	loadInternetUser: (data) => {
		console.log(data);
		return {
			type: types.LOAD_INTERNET_USER,
			payload: data
		};
	},
	loadInternetUserAccounts: (data) => {
		console.log('load internet users');
		console.log(data);
		return {
			type: types.LOAD_INTERNET_USER_ACCOUNTS,
			payload: data
		};
	},
	loadPackages: (data) => {
		console.log('load packages');
		return {
			type: types.LOAD_PACKAGES,
			payload: data
		};
	},
	fetchInternetUsers: (params) => {
		return async (dispatch, getState) => {
			try {
				console.log(params);
				dispatch(globalActions.shouldLoad(true));
				const data = await ispService.getAllUsers(params);
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
	fetchInternetUserAccounts: (params) => {
		return async (dispatch, getState) => {
			try {
				dispatch(globalActions.shouldLoad(true));
				const data = await ispService.getAllUserAccounts(params);
				console.log(data);
				dispatch(globalActions.loadInternetUserAccounts(data));
			} catch (error) {
				//or popup notification
				console.log(error);
			} finally {
				dispatch(globalActions.shouldLoad(false));
			}
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
	searchForUserAcc: (term) => {
		console.log(`searching: ${term}`);
		return async (dispatch, getState) => {
			try {
				console.log(term);
				dispatch(globalActions.showSearch(true));
				const data = await ispService.searchUserAccount(term);
				// const data = getState().isp.userAccounts.items.filter((userAcc) => {
				//   console.log(userAcc);
				//   return (
				//     userAcc.firstName.toLowerCase().indexOf(term) !== -1 ||
				//     userAcc.lastName.toLowerCase().indexOf(term) !== -1
				//   );
				// });
				// const mockPaggedData = new Pagged(data, 0, 1, data.length);
				console.log(`datareturned: ${JSON.stringify(data)}`);
				return dispatch(globalActions.loadInternetUserAccounts(data));
			} catch (error) {
				console.log(err);
				//need to use a logger
			} finally {
				dispatch(globalActions.showSearch(false));
			}
		};
	},
	generateMonthlyBill: (date) => {
		return async (dispatch, getState) => {
			console.log(date);
			const data = await ispService.generateMonthlyBill(date);
			if (data && data.hasOwnProperty('message')) {
				showNotification({ title: '', message: data.message });
			}
			//console.log(data);
			dispatch(globalActions.fetchInternetUserAccounts());
		};
	}
};

export { globalActions };
