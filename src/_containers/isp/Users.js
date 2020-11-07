import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { globalActions } from '@/_actions/globalActions';
import {
	Segment,
	Table,
	Tab,
	Header,
	Container,
	Grid,
	Button,
	Checkbox,
	Icon,
	Dropdown,
	Message
} from 'semantic-ui-react';
import './users.less';
import { ispService } from '@/_services/';
import AddUserModel from '@/_components/ui/add_user_model/AddUserModel';
import AddPackageModal from '@/_components/ui/add_package_modal/AddPackageModal';
import { Loading } from '@/_components/';
import { Options } from '@/_containers/isp/Constants';
import _ from 'lodash';

const Users = ({ history }) => {
	const users = useSelector((state) => state.isp.users);
	const showLoading = useSelector((state) => state.global.showLoading);
	const [ showUserModel, setShowUserModel ] = useState(false);
	const [ showPackageModel, setShowPackageModel ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const dispatch = useDispatch();
	const [ selected, setSelected ] = useState([]);
	const [ isEdit, setIsEdit ] = useState(false);
	const dropDownRef = useRef(null);
	const tableHeader = [ '', 'First Name', 'Last Name', 'Phone Number', 'Profile', 'Address', 'Created At' ];

	useEffect(
		() => {
			console.log('fetching users');
			dispatch(globalActions.fetchInternetUsers({ page: 0, pageSizeParam: 50 }));
			return () => {};
		},
		[ users.dispatch ]
	);

	const onSubmit = () => {
		setShowUserModel(false);
		setSelected([]);
		setIsEdit(false);
		dropDownRef.current.clearValue();
		dispatch(globalActions.fetchInternetUsers());
	};
	const handleCheckBox = (e, data, selectedId) => {
		if (data.checked) {
			setSelected(selected.concat(selectedId));
		} else {
			setSelected(selected.filter((id) => id != selectedId));
		}
	};

	const onPackageSubmit = () => {
		setShowPackageModel(false);
	};
	const handleOnDropDownAction = (e, data) => {
		console.log(data.value);
		console.log([ ...selected ]);
		switch (data.value) {
			case 'edit':
				setIsEdit(true);
				setShowUserModel(true);
				break;
			case 'delete':
				//remove selected User
				deleteSelectedUser();
				break;
		}
	};

	const deleteSelectedUser = async () => {
		try {
			//show loading before
			if (selected.length == 0) {
				//show error (no item selected)
				return;
			}
			dispatch(globalActions.shouldLoad(true));
			const deleted = await ispService.deleteUser(selected.pop());
			dispatch(globalActions.shouldLoad(false));
			dispatch(globalActions.fetchInternetUsers());
			console.log(deleted);
		} catch (err) {
			console.log(err);
		} finally {
			//hide loading
			dropDownRef.current.clearValue();
		}
	};

	return (
		<Container className="userslist" fluid style={{ padding: '10px' }}>
			<Grid>
				<Grid.Row>
					<Grid.Column floated="left" width={4}>
						<div className="header">
							<Header as="h1" className="userslist__header">
								Internet Users
							</Header>
						</div>
					</Grid.Column>
					<Grid.Column floated="right" width={12}>
						<div>
							<Button
								floated="right"
								icon
								className="userslist__action-button basicStyle"
								onClick={() => setShowPackageModel(true)}
							>
								<Icon name="plus" /> Add Package
							</Button>
							<Button
								floated="right"
								icon
								className="userslist__action-button basicStyle"
								onClick={() => setShowUserModel(true)}
							>
								<Icon name="add user" /> Add User
							</Button>
							<Button
								floated="right"
								icon
								className="userslist__action-button basicStyle"
								onClick={(_) => history.push('importusers')}
							>
								<Icon name="upload" /> Import Users
							</Button>
							<Button.Group className="actionsgroup">
								<Dropdown
									className="button icon actionsgroup__dropdown"
									floating
									clearable
									ref={dropDownRef}
									disabled={selected.length == 0}
									onChange={(e, d) => {
										console.log(e);
										handleOnDropDownAction(e, d);
									}}
									options={Options}
									trigger={
										<Button
											content="Actions"
											disabled={selected.length == 0}
											className="actionsgroup__button"
										/>
									}
								/>
							</Button.Group>
							<AddUserModel
								open={showUserModel}
								selectedIds={selected}
								onSubmit={onSubmit}
								edit={isEdit}
								onClose={() => {
									dropDownRef.current.clearValue();
									setIsEdit(false);
									setSelected([]);
									setShowUserModel(false);
								}}
							/>
							<AddPackageModal
								open={showPackageModel}
								onSubmit={onPackageSubmit}
								onClose={() => {
									setShowPackageModel(false);
								}}
							/>
						</div>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			{showLoading ? (
				<Loading />
			) : users.length > 0 ? (
				<Table>
					<Table.Header>
						<Table.Row>
							{tableHeader.map((header, i) => <Table.HeaderCell key={i}>{header}</Table.HeaderCell>)}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{users.map((user) => {
							return (
								<Table.Row key={user.id}>
									<Table.Cell collapsing>
										<Checkbox onChange={(e, d) => handleCheckBox(e, d, user.id)} />
									</Table.Cell>
									<Table.Cell>{user.firstName}</Table.Cell>
									<Table.Cell>{user.lastName}</Table.Cell>
									<Table.Cell>{user.phoneNumber}</Table.Cell>
									<Table.Cell>{user.package ? user.package.displayName : 'N/A'}</Table.Cell>
									<Table.Cell>{user.address}</Table.Cell>
									<Table.Cell>{user.created}</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			) : (
				<Segment>
					<Message className="emptyusermsg">
						<Message.Content>
							<h4 style={{ margin: 0, padding: 0 }}>You have no Users!</h4>{' '}
							<Button
								onClick={() => setShowUserModel(true)}
								style={{ marginTop: '10px' }}
								className="basicStyle"
								icon
							>
								<Icon name="add user" /> Add User
							</Button>
						</Message.Content>
					</Message>
				</Segment>
			)}
		</Container>
	);
};

export { Users };
