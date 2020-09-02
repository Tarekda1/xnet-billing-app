import React from "react";

const AddUserPackage = ({ setShowPackageModal, open }) => {
  const onAdd = (e) => {
    e.preventDefault();
  };
  return (
    <Modal
      open={open}
      onClose={() => setShowPackageModal(false)}
      onOpen={() => setShowPackageModal(true)}
    >
      <Header>Add Package</Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input placeholder="first name" />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Add" onClick={onAdd} positive />
        <Button color="black" onClick={onClose}>
          onClose
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddUserPackage;
