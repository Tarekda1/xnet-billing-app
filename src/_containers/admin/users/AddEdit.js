import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import _ from "lodash";
import * as Yup from "yup";
import {
  Modal,
  Button,
  Grid,
  Input,
  Segment,
  Dropdown,
} from "semantic-ui-react";
import { accountService, alertService } from "@/_services";
import "./add-edit.less";

function AddEdit({ history, match, open, id, onSave, onClose }) {
  const isAddMode = !id;

  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .concat(isAddMode ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .when("password", (password, schema) => {
        if (password) return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
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
        alertService.success("User added successfully", {
          keepAfterRouteChange: true,
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

  const roles = ["Admin", "User"];

  const rolesOptions = _.map(roles, (value, index) => ({
    key: roles[index],
    text: value,
    value: roles[index],
  }));

  const titles = ["Mr,Mrs"];
  const titleOptions = _.map(titles, (title, index) => ({
    key: titles[index],
    text: title,
    value: titles[index],
  }));

  return (
    <Modal open={open}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => {
          useEffect(() => {
            if (!isAddMode) {
              // get user and set form fields
              accountService.getById(id).then((user) => {
                const fields = [
                  "title",
                  "firstName",
                  "lastName",
                  "email",
                  "role",
                ];
                fields.forEach((field) =>
                  setFieldValue(field, user[field], false)
                );
              });
            }
          }, []);

          return (
            <Form style={{ padding: "15px" }}>
              <h1>{isAddMode ? "Add User" : "Edit User"}</h1>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <div className="form-group__col">
                      <label>Title</label>
                      <Dropdown
                        placeholder="title"
                        options={titleOptions}
                        className={
                          "form-control" +
                          (errors.title && touched.title ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>First Name</label>
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        className={
                          "form-control" +
                          (errors.firstName && touched.firstName
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Last Name</label>
                      <Input
                        name="lastName"
                        placeholder="Last Name"
                        className={
                          "form-control" +
                          (errors.lastName && touched.lastName
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>email</label>
                      <Input
                        name="email"
                        placeholder="Last Name"
                        type="text"
                        className={
                          "form-control" +
                          (errors.email && touched.email ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Role</label>
                      <Dropdown
                        placeholder="Role"
                        className="ui selection fluid dropdown"
                        options={rolesOptions}
                      />
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div className="form-row"></div>
                    {!isAddMode && (
                      <div>
                        <p>Leave blank to keep the same password</p>
                      </div>
                    )}
                    <div className="form-row">
                      <div className="form-group__col">
                        <label>Password</label>
                        <Input
                          name="password"
                          type="password"
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group__col">
                        <label>Confirm Password</label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          className={
                            "form-control" +
                            (errors.confirmPassword && touched.confirmPassword
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Segment floated="right" className="form-group">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1" />
                  )}
                  Save
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                  className="btn btn-primary"
                >
                  Cancel
                </Button>
              </Segment>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export { AddEdit };
