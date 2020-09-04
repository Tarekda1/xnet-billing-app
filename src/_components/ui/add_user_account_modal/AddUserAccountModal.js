import React, { useState, useEffect, useRef } from "react";
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
import { formatDate } from "@/_helpers/utility";

const AddUserAccountModel = ({ open, onSubmit, onClose }) => {
  //onst [showModel, setshowModel] = useState(true);
  const mountedRef = useRef(true);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    paid: false,
    comment: "",
    amount: 0,
  });

  const fetchUsers = async () => {
    const users = await ispService.getAllUsers();
    const usersData = users.map((usr) => ({
      text: `${usr.firstName} ${usr.lastName}`,
      key: usr.id,
      value: usr.id,
    }));
    if (mountedRef.current) {
      setUsersData(usersData);
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchUsers();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchUsers]);

  const fillEntity = (key, value) => {
    console.log(key);
    console.log(value);
    setFormData({ ...formData, [key]: value });
    console.log(formData);
  };

  const handlechange = (event, obj) => {
    setFormData({ ...formData, user: obj.value });
  };

  const onAddUserUserAccount = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formatedDate = formatDate(new Date(), "dd/mm/yyyy");
      console.log(formatedDate);
      const body = { ...formData, billDate: formatedDate };
      console.log(`body: ${JSON.stringify(body)}`);
      await ispService.createUserAccount(body);
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
                  <Form.Select
                    fluid
                    loading={loading}
                    label="User"
                    options={usersData}
                    placeholder="Select User"
                    onChange={handlechange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Paid</label>
                  <Checkbox
                    placeholder="paid"
                    onChange={(e, data) => {
                      fillEntity("paid", data.checked);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Amount</label>
                  <Input
                    placeholder="amount in LBP"
                    onChange={(e) => {
                      fillEntity("amount", e.target.value);
                    }}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Field>
                  <label>Comment</label>
                  <Input
                    placeholder="add comment..."
                    onChange={(e) => {
                      fillEntity("comment", e.target.value);
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
          <Button
            content="Add"
            loading={submitting}
            onClick={onAddUserUserAccount}
          />
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default AddUserAccountModel;
