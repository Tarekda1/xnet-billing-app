import React, { useState, useEffect } from "react";
import {
  Segment,
  Header,
  Container,
  Menu,
  Button,
  List,
  Table,
  Icon,
  Checkbox,
} from "semantic-ui-react";
import "./billing.css";
import AddUserAccountModal from "@/_components/ui/add_user_account_modal/AddUserAccountModal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/actions/globalActions";
import { ispService } from "@/_services/isp.service";
import { func } from "prop-types";

export const Billing = ({ match }) => {
  const dispatch = useDispatch();
  const { path } = match;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userAccounts = useSelector((state) => state.isp.userAccounts);
  //const [showEditModel, setShowEditModel] = useState(false);
  const [selectUserAcc, setSelectedUserAcc] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const onAddUserAccModalClose = () => {
    setOpenAddModal(false);
  };
  const onSubmitAddUserAccModel = () => {
    setOpenAddModal(false);
    //todo refresh users
    dispatch(globalActions.fetchInternetUserAccounts());
  };

  const onEditUserAccModal = (id) => {
    const userAcc = userAccounts.filter((ua) => ua.id === id)[0];
    setIsEdit(true);
    setSelectedUserAcc(userAcc);
    setOpenAddModal(true);
  };

  useEffect(() => {
    console.log("fetching user accounts");
    dispatch(globalActions.fetchInternetUserAccounts());
    return () => {};
  }, []);

  const deleteUserAcc = (e) => {};

  const onPaidChecked = (e, id) => {
    console.log("updating use account");
    console.log(e.checked);
    console.log(id);
    const userAcc = userAccounts.filter((ua) => ua.id === id)[0];
    console.log(userAcc);
    const userAccPost = {
      paid: e.checked,
      comment: userAcc.comment,
      billDate: userAcc.billDate,
    };
    if (userAcc) dispatch(globalActions.updateUserAcc(id, userAccPost));
  };

  const tableHeader = [
    "First Name",
    "Last Name",
    "Phone Number",
    "Paid",
    "Amount",
    "Comment",
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
              userAcc={selectUserAcc}
              edit={isEdit}
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
                    address: userAddress,
                  },
                  comment,
                  paid,
                  amount,
                  billDate,
                  id,
                },
                index
              ) => {
                return (
                  <Table.Row className="useraccounts" key={index}>
                    <Table.Cell>{firstName}</Table.Cell>
                    <Table.Cell>{lastName}</Table.Cell>
                    <Table.Cell>{phoneNumber}</Table.Cell>
                    {/* <Table.Cell>{profile}</Table.Cell> */}
                    <Table.Cell>
                      <Checkbox
                        name="paid"
                        onChange={(e, event) => onPaidChecked(event, id)}
                        toggle
                        checked={paid}
                      />
                    </Table.Cell>
                    <Table.Cell>{amount}</Table.Cell>
                    <Table.Cell>{comment}</Table.Cell>
                    <Table.Cell>{billDate}</Table.Cell>
                    <Table.Cell tyle={{ whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <Button
                          icon
                          primary
                          onClick={() => onEditUserAccModal(id)}
                          className="btn btn-sm btn-primary mr-1"
                        >
                          <Icon name="edit" />
                        </Button>
                        <Button
                          onClick={(id) => deleteUserAcc(id)}
                          icon
                          className="useraccounts__button useraccounts__button-delete"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <Icon name="user delete" />
                          )}
                        </Button>
                      </div>
                    </Table.Cell>
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
