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

const Users = () => {
  const users = useSelector((state) => state.isp.users);
  const dispatch = useDispatch();
  const tableHeader = [
    "First Name",
    "Last Name",
    "Phone Number",
    "Address",
    "Created At",
  ];

  useEffect(() => {
    console.log("fetching users");
    dispatch(globalActions.fetchInternetUsers());
    return () => {};
  }, []);

  return (
    <Container fluid="true" style={{ padding: "10px" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column floated="left" width={4}>
            <Header as="h1"> Xnet ISP Users</Header>
          </Grid.Column>
          <Grid.Column floated="right" width={12}>
            <Button floated="right">Add Package</Button>
            <Button floated="right">Add User</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table>
        <Table.Header>
          <Table.Row>
            {tableHeader.map((header) => (
              <Table.HeaderCell>{header}</Table.HeaderCell>
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
