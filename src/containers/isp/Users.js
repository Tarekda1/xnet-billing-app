import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalActions } from "@/actions/globalActions";
import {
  Segment,
  Table,
  Tab,
  Header,
  Container,
  Grid,
  Button,
} from "semantic-ui-react";
import AddUserModel from "@/_components/ui/add_user_model/AddUserModel";
import AddPackageModal from "@/_components/ui/add_package_modal/AddPackageModal";

const Users = () => {
  const users = useSelector((state) => state.isp.users);
  const [showUserModel, setShowUserModel] = useState(false);
  const [showPackageModel, setShowPackageModel] = useState(false);
  const dispatch = useDispatch();
  const tableHeader = [
    "First Name",
    "Last Name",
    "Phone Number",
    "Profile",
    "Address",
    "Created At",
  ];

  useEffect(() => {
    console.log("fetching users");
    dispatch(globalActions.fetchInternetUsers());
    return () => {};
  }, []);

  const onSubmit = () => {
    setShowUserModel(false);
    dispatch(globalActions.fetchInternetUsers());
  };

  const onPackageSubmit = () => {
    setShowPackageModel(false);
  };

  return (
    <Container fluid style={{ padding: "10px" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column floated="left" width={4}>
            <Header as="h1"> Xnet ISP Users</Header>
          </Grid.Column>
          <Grid.Column floated="right" width={12}>
            <Button floated="right" onClick={() => setShowPackageModel(true)}>
              Add Package
            </Button>
            <Button floated="right" onClick={() => setShowUserModel(true)}>
              Add User
            </Button>
            <AddUserModel
              open={showUserModel}
              onSubmit={onSubmit}
              onClose={() => {
                setShowUserModel(false);
              }}
            />
            <AddPackageModal
              open={showPackageModel}
              onSubmit={onPackageSubmit}
              onClose={() => {
                setShowPackageModel(false);
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table>
        <Table.Header>
          <Table.Row>
            {tableHeader.map((header, i) => (
              <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => {
            return (
              <Table.Row key={user.id}>
                <Table.Cell>{user.firstName}</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
                <Table.Cell>{user.phoneNumber}</Table.Cell>
                <Table.Cell>
                  {user.package ? user.package.displayName : "N/A"}
                </Table.Cell>
                <Table.Cell>{user.address}</Table.Cell>
                <Table.Cell>{user.created}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export { Users };
