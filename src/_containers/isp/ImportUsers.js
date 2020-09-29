import React from "react";

const ImportUsers = () => {
  return (
    <Container className="importedUserslist" fluid style={{ padding: "10px" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column floated="left" width={4}>
            <div className="header">
              <Header as="h1" className="importedUserslist__header">
                Import users
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
                onClick={(_) => console.log("click")}
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
                  options={options}
                  trigger={
                    <Button
                      content="Actions"
                      disabled={selected.length == 0}
                      className="actionsgroup__button"
                    />
                  }
                />
              </Button.Group>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default ImportUsers;
