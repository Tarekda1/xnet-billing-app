import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Grid, Button, Header } from 'semantic-ui-react';
import './TopNavigation.less';
import { useSelector, useDispatch } from 'react-redux';
import userActions from '@/actions/userActions';
import { useHistory } from 'react-router-dom';
//import i18n from '../../../Translation';
import globalActions from '@/actions/globalActions';
import { useTranslation } from 'react-i18next';

const TopNavigation = ({ i18n }) => {
	//const token = localStorage.getItem('token');
	const user = useSelector((state) => state.user.userInfo);
	const token = useSelector((state) => state.user.token);
	// console.log(`token ${token}`);
	// console.log(user);
	// console.log('isequal' + user !== undefined);
	const dispatch = useDispatch();
	const history = useHistory();

	const language = useSelector((state) => state.global.language);
	const [ selectedLanguage, setSelectedLanguage ] = useState('');

	//i18n.changeLanguage(selectedLanguage);

	//const { t } = useTranslation();

	useEffect(
		() => {
			console.log(language);
			if (language !== undefined) {
				setSelectedLanguage(language);
			}
			i18n.changeLanguage(language);
		},
		[ dispatch, language ]
	);

	const { t } = useTranslation();

	let dropdown = [
		{
			key: 'username',
			text: user && user.firstName,
			value: 'username'
		},
		{
			key: 'Logout',
			text: 'Logout',
			value: 'logout'
		}
	];

	let languageSelection = [
		{
			key: 1,
			text: 'English',
			value: 'en'
		},
		{
			key: 2,
			text: 'العربية',
			value: 'ar'
		}
	];

	function onDropdownSelection(element, data) {
		if (data.value === 'logout') {
			dispatch(userActions.performLogout());
			history.push('/');
			window.location.reload();
		}
	}

	function onLanguageChange(element, data) {
		i18n.changeLanguage(data.value);
		dispatch(globalActions.changeLanguage(data.value));
	}

	return token ? (
		<Grid className="topNavigationContainer">
			<Grid.Column>
				<Header as="h1" />
			</Grid.Column>
			<Grid.Column className="squeez" floated="right">
				<Menu floated="right" compact>
					<Dropdown text={user.firstName} options={dropdown} onChange={onDropdownSelection} simple item />
				</Menu>
				<Menu floated="right" compact>
					<Dropdown
						key={selectedLanguage}
						defaultValue={selectedLanguage.toString()}
						options={languageSelection}
						onChange={onLanguageChange}
						simple
						item
					/>
				</Menu>
			</Grid.Column>
		</Grid>
	) : (
		''
	);
};

export { TopNavigation };
