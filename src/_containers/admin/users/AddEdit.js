import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
import _, { get } from 'lodash';
import * as Yup from 'yup';
import { Modal, Button, Grid, Input, Segment, Dropdown, Icon, Form, Message } from 'semantic-ui-react';
import { accountService, alertService } from '@/_services';
import './add-edit.less';

function AddEdit({ history, match, open, Id, onSave, onClose }) {
	const isAddMode = !Id;
	const isVisible = useRef(false);
	const [ id, setId ] = useState(-1);
	const [ user, setUser ] = useState({
		firstName: '',
		lastName: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: ''
	});
	const [ errors, setErrors ] = useState({});
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const initialValues = {
		title: '',
		firstName: '',
		lastName: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: ''
	};

	useEffect(() => {
		setId(Id);
		return () => {};
	});

	useEffect(
		() => {
			console.log(`id ${Id}`);
			// if (id !== Id) {
			if (!isAddMode && open) {
				//console.log(`id ${id}`);
				function fillUserForm(userObj) {
					setUser(userObj);
					// const fields = [ 'title', 'firstName', 'lastName', 'email', 'role' ];
					// fields.forEach((field) => {
					// 	setFieldValue(field, userObj[field], false);
					// });
				}
				accountService.getById(Id).then((tempuser) => {
					console.log(tempuser);
					fillUserForm(tempuser);
				});
			}
			return () => {
				isVisible.current = false;
			};
			//}
		},
		[ open ]
	);

	const validationSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		firstName: Yup.string().required('First Name is required'),
		lastName: Yup.string().required('Last Name is required'),
		email: Yup.string().email('Email is invalid').required('Email is required'),
		role: Yup.string().required('Role is required'),
		password: Yup.string()
			.concat(isAddMode ? Yup.string().required('Password is required') : null)
			.min(6, 'Password must be at least 6 characters'),
		confirmPassword: Yup.string()
			.when('password', (password, schema) => {
				if (password) return schema.required('Confirm Password is required');
			})
			.oneOf([ Yup.ref('password') ], 'Passwords must match')
	});

	function onSubmit(fields, { setStatus, setSubmitting }) {
		setStatus();
		if (isAddMode) {
			createUser(fields, setSubmitting);
		} else {
			updateUser(id, fields, setSubmitting);
		}
	}

	function createUser(fields, setSubmitting) {
		accountService
			.create(fields)
			.then(() => {
				alertService.success('User added successfully', {
					keepAfterRouteChange: true
				});
				onSave();
			})
			.catch((error) => {
				setSubmitting(false);
				alertService.error(error);
			});
	}

	function updateUser(id, fields, setSubmitting) {
		accountService
			.update(id, fields)
			.then(() => {
				// alertService.success("Update successful", {
				//   keepAfterRouteChange: true,
				// });
				onSave();
				//history.push("..");
			})
			.catch((error) => {
				setSubmitting(false);
				alertService.error(error);
			});
	}

	const roles = [ 'Admin', 'User' ];

	const rolesOptions = _.map(roles, (value, index) => ({
		key: roles[index],
		text: value,
		value: roles[index]
	}));

	const titles = [ 'Mr', 'Mrs' ];
	const titleOptions = _.map(titles, (title, index) => ({
		key: titles[index],
		text: title,
		value: titles[index]
	}));

	return (
		<Modal open={open}>
			{/* <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
				{({ errors, touched, isSubmitting, setFieldValue }) => { */}

			<Form style={{ padding: '15px' }}>
				<h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
				<Grid>
					<Grid.Row>
						<Grid.Column width={8}>
							<div className="form-group__col">
								<label>Title</label>
								<Dropdown
									placeholder="title"
									options={titleOptions}
									value={user.title}
									className={`ui selection fluid dropdown
                          ${errors.title ? ' is-invalid' : ''}`}
								/>
								<Message name="title" component="div" className="invalid-feedback" />
							</div>
							<div className="form-group__col">
								<label>First Name</label>
								<Input
									placeholder="First Name"
									value={user.firstName}
									className={'form-control' + (errors.firstName ? ' is-invalid' : '')}
								/>
								<Message
									hidden={!errors.hasOwnProperty('firstName')}
									component="div"
									className="invalid-feedback"
								/>
							</div>
							<div className="form-group__col">
								<label>Last Name</label>
								<Input
									placeholder="Last Name"
									value={user.lastName}
									className={'form-control' + (errors.lastName ? ' is-invalid' : '')}
								/>
								<Message name="lastName" component="div" className="invalid-feedback" />
							</div>
							<div className="form-group__col">
								<label>email</label>
								<Input
									placeholder="Last Name"
									value={user.email}
									className={'form-control' + (errors.email ? ' is-invalid' : '')}
								/>
								<Message name="email" component="div" className="invalid-feedback" />
							</div>
							<div className="form-group__col">
								<label>Role</label>
								<Dropdown
									placeholder="Role"
									className="ui selection fluid dropdown"
									value={user.role}
									options={rolesOptions}
								/>
								<Message name="role" component="div" className="invalid-feedback" />
							</div>
						</Grid.Column>
						<Grid.Column width={8}>
							<div className="form-row" />
							{!isAddMode && (
								<div>
									<p>Leave blank to keep the same password</p>
								</div>
							)}
							<div className="form-row">
								<div className="form-group__col">
									<label>Password</label>
									<Input
										type="password"
										className={
											'form-control' + (errors.password && touched.password ? ' is-invalid' : '')
										}
									/>
									<Message name="password" component="div" className="invalid-feedback" />
								</div>
								<div className="form-group__col">
									<label>Confirm Password</label>
									<Input
										type="password"
										className={
											'form-control' +
											(errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')
										}
									/>
									<Message name="confirmPassword" component="div" className="invalid-feedback" />
								</div>
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Segment floated="right" className="form-group model-actions">
					<Button
						type="submit"
						disabled={isSubmitting}
						loading={isSubmitting}
						className="btn basicStyle"
						icon
					>
						<Icon name="save" /> Save
					</Button>
					<Button
						onClick={(e) => {
							e.preventDefault();
							setUser({});
							onClose();
						}}
						className="btn basicStyle"
					>
						Cancel
					</Button>
				</Segment>
			</Form>

			{/* }}
			</Formik> */}
		</Modal>
	);
}

export { AddEdit };
