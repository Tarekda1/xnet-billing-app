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
const AddPackageModal = ({ open, onSubmit, onClose }) => {
  // const [showModel, setshowModel] = useState(true);
  // const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const onAddPackage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await ispService.createPackage({ displayName });
      setSubmitting(false);
      onSubmit();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      // onClose={() => setshowModel(false)}
      // onOpen={() => setshowModel(true)}
    >
      <Header>Add Profile</Header>
      <Modal.Content>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Field>
                  <label>Package Name</label>
                  <Input
                    placeholder="Package name"
                    onChange={(e) => {
                      setDisplayName(e.target.value);
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
          <Button content="Add" loading={submitting} onClick={onAddPackage} />
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default AddPackageModal;
