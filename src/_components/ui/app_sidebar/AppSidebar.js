import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Menu, Sidebar, Image } from 'semantic-ui-react';
import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import { useTranslation } from 'react-i18next';
import './AppSidebar.less';
import logo from '../../../images/xnet_logo_main.png';
import { async } from 'rxjs';
import userActions from '@/_actions/userActions';
function AppSidebar(props) {
	const language = 'en';
	const history = useHistory();
	//const token = localStorage.getItem('token');
	const user = useSelector((state) => state.user.userInfo);
	const token = useSelector((state) => state.user.token);
	const dispatch = useDispatch();
	//console.log(token);

	return token ? (
		<Sidebar.Pushable>
			<Sidebar
				as={Menu}
				animation="overlay"
				icon="labeled"
				inverted
				direction={language === 'en' ? 'left' : 'right'}
				vertical
				visible
				width="wide"
				className={'sidebar-wrapper'}
			>
				<Menu.Item as="a" onClick={() => history.push('/')}>
					{/*<Image src="https://s3-us-west-2.amazonaws.com/cherpa01-static/landing/logo/cherpa_logo_orange.svg"></Image>*/}
					{/* <Image src={xnet_logo_main} /> */}
					<Image src={logo} />
				</Menu.Item>
				{/* <NavLink exact to="/" className="nav-item nav-link">
    Dashboard
  </NavLink> */}
				<Menu.Item as="a" onClick={() => history.push('/profile')}>
					<Icon name="user" />
					profile
				</Menu.Item>

				<Menu.Item as="a" onClick={() => history.push('/admin/users')}>
					<Icon name="cog" />
					Admin
				</Menu.Item>
				<Menu.Item as="a" onClick={() => history.push('/isp-users/users')}>
					<Icon name="users" />
					Internet Users
				</Menu.Item>
				<Menu.Item as="a" onClick={() => history.push('/isp-users/accounting')}>
					<Icon name="calculator" />
					Accounting
				</Menu.Item>
				<Menu.Item
					as="a"
					onClick={() => {
						accountService.logout(() => {
							dispatch(userActions.performLogout());
							history.push('/accounts/login');
						});
					}}
				>
					<Icon name="log out" />
					Logout
				</Menu.Item>
				{/* <Route path="/admin" component={AdminNav} /> */}
			</Sidebar>
			<Sidebar.Pusher style={language === 'en' ? { marginLeft: '100px' } : { marginRight: '100px' }}>
				{props.children}
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	) : (
		<div>{props.children}</div>
	);
}

export { AppSidebar };
