import { combineReducers } from 'redux';
import user from './user';
import global from './global';
import internet_users from './internet_users';

const appReducer = combineReducers({
	user,
	global,
	internet_users
});

export default (state, action) => {
	if (action.type === 'PERFORM_LOGOUT') {
		state = undefined;
	}
	return appReducer(state, action);
};
