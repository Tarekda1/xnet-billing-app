import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { accountService } from '@/_services';
import { Loading } from '@/_components';
import { Segment, Table, Button } from 'semantic-ui-react';

function List({ match }) {
	const { path } = match;
	const [ users, setUsers ] = useState(null);
	const [ loading, setloading ] = useState(true);

	useEffect(() => {
		accountService.getAll().then((x) => {
			setUsers(x);
			setloading(false);
			return () => {
				setUsers([]);
			};
		});
	}, []);

	function deleteUser(id) {
		setUsers(
			users.map((x) => {
				if (x.id === id) {
					x.isDeleting = true;
				}
				return x;
			})
		);
		accountService.delete(id).then(() => {
			setUsers((users) => users.filter((x) => x.id !== id));
		});
	}

	return (
		<Segment>
			<h1>Portal Users</h1>
			<p>All users from secure (admin only) api end point:</p>
			<Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">
				Add User
			</Link>
			{loading ? (
				<Loading />
			) : (
				<Table className="table table-striped">
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
						{users &&
							users.map((user) => (
								<Table.Row key={user.id}>
									<Table.Cell>
										{user.title} {user.firstName} {user.lastName}
									</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>{user.isVerified ? 'true' : 'false'}</Table.Cell>
									<Table.Cell>{user.created}</Table.Cell>
									<Table.Cell>{user.role}</Table.Cell>
									<Table.Cell tyle={{ whiteSpace: 'nowrap' }}>
										<div style={{ display: 'flex', flexDirection: 'row' }}>
											<Link
												to={`${path}/edit/${user.id}`}
												style={{
													padding: '10px',
													background: 'green',
													marginRight: '10px',
													borderRadius: '5px',
													color: 'white'
												}}
												className="btn btn-sm btn-primary mr-1"
											>
												Edit
											</Link>
											<Button
												onClick={() => deleteUser(user.id)}
												className="btn btn-sm btn-danger"
												style={{ background: 'red', color: 'white' }}
												disabled={user.isDeleting}
											>
												{user.isDeleting ? (
													<span className="spinner-border spinner-border-sm" />
												) : (
													<span>Delete</span>
												)}
											</Button>
										</div>
									</Table.Cell>
								</Table.Row>
							))}
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
		</Segment>
	);
}

export { List };
