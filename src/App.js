import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import { PrivateRoute, Alert } from '@/_components';
import { AppSidebar } from '@/_components/ui/AppSidebar/AppSidebar';
import { Dashboard } from '@/containers/dashboard';
import { Profile } from '@/containers/profile';
import { Account } from '@/containers/account';
import { VerifyEmail } from '@/containers/account/VerifyEmail';
import { Admin } from '@/containers/Admin';
import { Provider } from 'react-redux';
import { store } from './store';
import { Login } from '@/containers/account/Login';
import { Register } from '@/containers/account/Register';
import { TopNavigation } from '@/_components';
function App({ trans }) {
	let user;

	// const [ user, setUser ] = useState({});

	// useEffect(() => {
	// try {
	// 	let tempUser = localStorage.getItem('user');
	// 	console.log(tempUser);
	// 	if (tempUser !== '') {
	// 		tempUser = JSON.parse(localStorage.getItem('user'));
	// 		user = tempUser;
	// 	}
	// } catch (err) {
	// 	user = null;
	// }
	// }, []);

	return (
		<Provider store={store}>
			<Router>
				<AppSidebar>
					<TopNavigation i18n={trans} />
					<Switch>
						{/* <PrivateRoute path="/profile" component={Profile} />
					<PrivateRoute path="/accounts/users" roles={[ Role.Admin ]} component={Users} />*/}
						<PrivateRoute exact path="/dashboard" component={Dashboard} />
						<Route path="/profile" component={Profile} />
						<Route path="/account">
							<Account />
						</Route>
						<Route path="/admin">
							<Admin />
						</Route>
						<Redirect from="*" to="/dashboard" />
					</Switch>
				</AppSidebar>
			</Router>
		</Provider>
	);
}

export { App };
