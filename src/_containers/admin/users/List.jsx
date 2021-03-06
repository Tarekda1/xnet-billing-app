import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { accountService } from '@/_services';
import { Loading } from '@/_components';
import { Segment, Table, Button, Icon, Confirm } from 'semantic-ui-react';
import { AddEdit } from './AddEdit';
import './List.less';

function List({ match }) {
	const { path } = match;
	const [ users, setUsers ] = useState([]);
	const [ loading, setloading ] = useState(true);
	const isVisibleRef = useRef(true);
	const [ selectedUserId, setselectedUserId ] = useState(-1);
	const [ showModal, setshowModal ] = useState(false);
	const [ openDelete, setOpenDelete ] = useState(false);
	const [ selectedIdForDelete, setSelectedIdForDelete ] = useState(-1);

	async function fetchUser() {
		const usersFromServer = await accountService.getAll();
		if (isVisibleRef.current) {
			setUsers(usersFromServer);
			setloading(false);
		}
	}

	async function fetchUserById() {
		try {
			const updateUser = await accountService.getById(selectedUserId);
			console.log(updateUser);
			if (updateUser) {
				let tempUsers = [ ...users ];
				let index;
				for (let i = 0; i < tempUsers.length; i++) {
					if (tempUsers[i].id === updateUser.id) {
						index = i;
					}
				}

				tempUsers[index] = updateUser;
				setUsers(tempUsers);
			}
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		fetchUser();
		return () => {
			isVisibleRef.current = false;
		};
	}, []);

	function deleteUser() {
		//show confirmation before delete
		setOpenDelete(false);
		setUsers(
			users.map((x) => {
				if (x.id === selectedIdForDelete) {
					x.isDeleting = true;
				}
				return x;
			})
		);
		accountService.delete(selectedIdForDelete).then((response) => {
			setUsers((users) => users.filter((x) => x.id !== selectedIdForDelete));
		});
	}

	return (
		<Segment>
			<h1>Portal Users</h1>
			<p>All users from secure (admin only) api end point:</p>
			<Button
				icon
				className="btn basicStyle"
				onClick={(e) => {
					setselectedUserId((prev) => -1);
					setshowModal(true);
				}}
			>
				<Icon name="plus" /> Add User
			</Button>
			{loading ? (
				<Loading />
			) : (
				<Table className="table table-striped users">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell style={{ width: '20%' }}>Name</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '25%' }}>Email</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '10%' }}>Is Verified</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '20%' }}>Created At</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '20%' }}>Role</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '40%' }} />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{users && users.length > 0 ? (
							users.map((user) => (
								<Table.Row className="users__row" key={user.id}>
									<Table.Cell>
										{user.title} {user.firstName} {user.lastName}
									</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>{user.isVerified ? 'true' : 'false'}</Table.Cell>
									<Table.Cell>{user.created}</Table.Cell>
									<Table.Cell>{user.role}</Table.Cell>
									<Table.Cell tyle={{ whiteSpace: 'nowrap' }}>
										<div style={{ display: 'flex', flexDirection: 'row' }}>
											<Button
												icon
												className="basicStyle"
												onClick={() => {
													setselectedUserId(user.id);
													setTimeout(() => {
														setshowModal(true);
													}, 100);
												}}
											>
												<Icon name="edit" />
											</Button>
											<Button
												onClick={() => {
													setSelectedIdForDelete(user.id);
													setOpenDelete(true);
												}}
												className="basicStyle users__row-delete"
												icon
												loading={user.isDeleting}
												disabled={user.role === 'Admin' || user.isDeleting}
											>
												<Icon name="trash" />
											</Button>
										</div>
									</Table.Cell>
								</Table.Row>
							))
						) : (
							<div>
								no users found <br />
								<Button>Add User Account</Button>
							</div>
						)}
						{!users && (
							<Table.Row>
								<td colSpan="4" className="text-center">
									<span className="spinner-border spinner-border-lg align-center" />
								</td>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			)}
			<AddEdit
				Id={selectedUserId}
				onSave={() => {
					setshowModal(false);
					if (selectedUserId === -1) {
						fetchUser();
					} else {
						//update user data
						fetchUserById();
					}
				}}
				open={showModal}
				onClose={() => {
					setselectedUserId(-1);
					setshowModal(false);
				}}
			/>
			<Confirm open={openDelete} onCancel={() => setOpenDelete(false)} onConfirm={deleteUser} />
		</Segment>
	);
}

export { List };
