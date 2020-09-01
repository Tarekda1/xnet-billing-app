import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter, Redirect, useRouteMatch } from 'react-router-dom';

import { accountService } from '@/_services';
import { PrivateRoute } from '@/_components';

import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

function Account(props) {
	let { path, url } = useRouteMatch();
	//const path = '/account';
	console.log(path);
	//console.log(props);
	// useEffect(
	// 	() => {
	// 		// redirect to home if already logged in
	// 		if (accountService.userValue) {
	// 			history.push('/');
	// 		}
	// 	},
	// 	[ accountService.userValue ]
	// );

	return (
		<div className="container">
			<div className="row">
				<div className="col-sm-8 offset-sm-2 mt-5">
					<div className="card m-3">
						<Switch>
							<Route exact path={`${path}/`} component={Login} />
							<Route path={`${path}/login`} component={Login} />
							<Route path={`${path}/register`} component={Register} />
							<Route path={`${path}/verify-email`} component={VerifyEmail} />
							<Route path={`${path}/forgot-password`} component={ForgotPassword} />
							<Route path={`${path}/reset-password`} component={ResetPassword} />
						</Switch>
					</div>
				</div>
			</div>
		</div>
	);
}

export { Account };
