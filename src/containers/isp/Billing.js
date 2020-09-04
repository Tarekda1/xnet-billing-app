import React, { useState, useEffect } from "react";
import {
  Segment,
  Header,
  Container,
  Menu,
  Button,
  List,
  Table,
} from "semantic-ui-react";
import "./billing.css";
import AddUserAccountModal from "../../_components/ui/add_user_account_modal/AddUserAccountModal";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/actions/globalActions";
import { ispService } from "../../_services/isp.service";
import { func } from "prop-types";

export const Billing = () => {
  const dispatch = useDispatch();
  const [openAddModal, setOpenAddModal] = useState(false);
  const userAccounts = useSelector((state) => state.isp.userAccounts);
  const onAddUserAccModalClose = () => {
    setOpenAddModal(false);
  };
  const onSubmitAddUserAccModel = () => {
    setOpenAddModal(false);
    //todo refresh users
    dispatch(globalActions.fetchInternetUserAccounts());
  };

  useEffect(() => {
    console.log("fetching user accounts");
    dispatch(globalActions.fetchInternetUserAccounts());
    return () => {};
  }, []);

  const tableHeader = [
    "First Name",
    "Last Name",
    "Phone Number",
    "Profile",
    "Address",
    "paid",
    "amount",
    "comment",
    "Month Bill Date",
  ];

  return (
    <Container fluid>
      <Segment className="toolbar">
        <Header floated="left" className="toolbar__header" as="h2">
          Accounting
        </Header>
        <List floated="right" horizontal>
          <List.Item>
            <List.Content>
              <Button content="Generate Monthly Bill" />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Button content="Export Data" />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Button
                content="Add User Account"
                onClick={() => setOpenAddModal(true)}
              />
            </List.Content>
            <AddUserAccountModal
              open={openAddModal}
              onClose={onAddUserAccModalClose}
              onSubmit={onSubmitAddUserAccModel}
            />
          </List.Item>
        </List>
      </Segment>
      <Segment className="Segment__noBorder">
        <Header as="h3">User accounts</Header>
        <Table>
          <Table.Header>
            <Table.Row>
              {tableHeader.map((header, i) => (
                <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {userAccounts.map(
              (
                {
                  user: {
                    firstName,
                    lastName,
                    phoneNumber,
                    package: profile,
                    address: userAddress,
                  },
                  comment,
                  paid,
                  amount,
                  billDate,
                },
                index
              ) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{firstName}</Table.Cell>
                    <Table.Cell>{lastName}</Table.Cell>
                    <Table.Cell>{phoneNumber}</Table.Cell>
                    <Table.Cell>{profile}</Table.Cell>
                    <Table.Cell>{userAddress}</Table.Cell>
                    <Table.Cell>{paid ? "Yes" : "Not yet"}</Table.Cell>
                    <Table.Cell>{amount}</Table.Cell>
                    <Table.Cell>{comment}</Table.Cell>
                    <Table.Cell>{billDate}</Table.Cell>
                  </Table.Row>
                );
              }
            )}
          </Table.Body>
        </Table>
      </Segment>
    </Container>
  );
};
