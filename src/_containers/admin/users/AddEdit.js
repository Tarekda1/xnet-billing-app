import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import _, { get } from "lodash";
import * as Yup from "yup";
import {
  Modal,
  Button,
  Grid,
  Input,
  Segment,
  Dropdown,
  Icon,
  Message,
  Header,
} from "semantic-ui-react";
import { accountService, alertService } from "@/_services";
import { Loading } from "@/_components/";
import "./add-edit.less";

function AddEdit({ history, match, open, Id, onSave, onClose }) {
  const [isAddMode, setIsAddMode] = useState(true);
  const isVisible = useRef(false);
  const [id, setId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  //const [errors, setErrors] = useState({});
  //const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    setId(Id);
    if (Number(Id) !== -1) {
      setIsAddMode(false);
    }
    return () => {};
  });

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

  const titles = ["Mr", "Mrs"];
  const titleOptions = _.map(titles, (title, index) => ({
    key: titles[index],
    text: title,
    value: titles[index],
  }));

  return (
    <Modal open={open}>
      <Header as="h2">{isAddMode ? "Add User" : "Edit User"}</Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => {
          useEffect(() => {
            console.log(`id ${Id}`);
            // if (id !== Id) {
            if (!isAddMode && open) {
              async function fetchUser() {
                setLoading(true);
                const userObj = await accountService.getById(Id).then();
                setUser(userObj);
                const fields = [
                  "title",
                  "firstName",
                  "lastName",
                  "email",
                  "role",
                ];
                fields.forEach((field) => {
                  setFieldValue(field, userObj[field], false);
                });
                setLoading(false);
              }
              fetchUser();
            }
            return () => {
              isVisible.current = false;
            };
            //}
          }, [open]);

          return (
            <Form style={{ padding: "15px" }}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <div className="form-group__col">
                      <label>Title</label>
                      <Dropdown
                        placeholder="title"
                        name="title"
                        options={titleOptions}
                        value={user.title}
                        onChange={(e, data) => {
                          setFieldValue("title", data.value);
                          setUser({
                            ...user,
                            title: data.value,
                          });
                        }}
                        className={`ui selection fluid dropdown
                          ${errors.title ? " is-invalid" : ""}`}
                      />
                      <ErrorMessage name="title" />
                    </div>
                    <div className="form-group__col">
                      <label>First Name</label>
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        value={user.firstName}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("firstName", data.value);
                          setUser({
                            ...user,
                            firstName: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.firstName ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="firstName"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>Last Name</label>
                      <Input
                        placeholder="Last Name"
                        value={user.lastName}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("lastName", data.value);
                          setUser({
                            ...user,
                            lastName: data.value,
                          });
                        }}
                        className={
                          "form-control" +
                          (errors.lastName ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="lastName"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group__col">
                      <label>email</label>
                      <Input
                        placeholder="email"
                        value={user.email}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("email", data.value);
                          setUser({
                            ...user,
                            email: data.value,
                          });
                        }}
                        className={
                          "form-control" + (errors.email ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage name="email" className="invalid-feedback" />
                    </div>
                    <div className="form-group__col">
                      <label>Role</label>
                      <Dropdown
                        placeholder="Role"
                        className="ui selection fluid dropdown"
                        value={user.role}
                        options={rolesOptions}
                        onChange={(e, data) => {
                          console.log(data);
                          setFieldValue("role", data.value);
                          setUser({
                            ...user,
                            role: data.value,
                          });
                        }}
                      />
                      <ErrorMessage name="role" className="invalid-feedback" />
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
                          onChange={(e, data) => {
                            console.log(data);
                            setFieldValue("password", data.value);
                            setUser({
                              ...user,
                              password: data.value,
                            });
                          }}
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="password"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group__col">
                        <label>Confirm Password</label>
                        <Input
                          type="password"
                          onChange={(e, data) => {
                            console.log(data);
                            setFieldValue("confirmPassword", data.value);
                            setUser({
                              ...user,
                              confirmPassword: data.value,
                            });
                          }}
                          className={
                            "form-control" +
                            (errors.confirmPassword && touched.confirmPassword
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          className="invalid-feedback"
                        />
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
                  {isAddMode ? (
                    <>
                      <Icon name="plus" />
                      Add
                    </>
                  ) : (
                    <>
                      {" "}
                      <Icon name="save" /> Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setUser(initialValues);
                    onClose();
                  }}
                  className="btn basicStyle"
                >
                  Cancel
                </Button>
              </Segment>
              {loading ? <Loading /> : ""}
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export { AddEdit };
