import React, { useState, useEffect } from "react";
import {
  Input,
  Segment,
  Form,
  Modal,
  Button,
  Header,
  Checkbox,
  Grid,
  Dropdown,
} from "semantic-ui-react";
import { ispService } from "@/_services/";
const AddUserModel = ({ open, onSubmit, onClose }) => {
  const [packages, setpackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    package: "",
    address: "",
    isActive: false,
    usename: "",
    email: "",
    password: "",
  });

  const fetchPackages = async () => {
    const packages = await ispService.getAllPackages();
    const packagesData = packages.map((pkg) => ({
      text: pkg.displayName,
      key: pkg.id,
      value: pkg.id,
    }));
    setpackages(packagesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
    return () => {};
  }, []);

  const fillEntity = (key, value) => {
    setFormData({ ...formData, [key]: value });
    console.log(formData);
  };

  const handlechange = (event, obj) => {
    setFormData({ ...formData, package: obj.value });
  };

  const onAddUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await ispService.createUser(formData);
      setSubmitting(false);
      onSubmit();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open}>
      <Header>Add User</Header>
      <Modal.Content>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Field>
                  <label>First Name</label>
                  <Input
                    placeholder="first name"
                    onChange={(e) => {
                      fillEntity("firstName", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <Input
                    placeholder="last name"
                    onChange={(e) => {
                      fillEntity("lastName", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Phone Number</label>
                  <Input
                    placeholder="phone number"
                    onChange={(e) => {
                      fillEntity("phoneNumber", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <Input
                    placeholder="password"
                    onChange={(e) => {
                      fillEntity("password", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Is Active</label>
                  <Checkbox
                    placeholder="address"
                    onChange={(e) => {
                      fillEntity("isActive", e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Field>
                  <Form.Field>
                    <label>Username</label>
                    <Input
                      placeholder="username"
                      onChange={(e) => {
                        fillEntity("username", e.target.value);
                      }}
                    />
                  </Form.Field>
                  <Form.Select
                    fluid
                    loading={loading}
                    label="Package"
                    options={packages}
                    placeholder="Select Package"
                    onChange={handlechange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <Input
                    placeholder="email"
                    onChange={(e) => {
                      fillEntity("email", e.target.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Address</label>
                  <Input
                    size="large"
                    placeholder="address"
                    onChange={(e) => {
                      fillEntity("address", e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <div style={{ float: "right" }}>
          <Button content="Add" loading={submitting} onClick={onAddUser} />
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default AddUserModel;
