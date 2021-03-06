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
  Input,
  Message,
} from "semantic-ui-react";
import "./billing.css";
import AddUserAccountModal from "@/_components/ui/add_user_account_modal/AddUserAccountModal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/_actions/globalActions";
import { ispService } from "@/_services/isp.service";
import { func } from "prop-types";

export const Billing = ({ match }) => {
  const dispatch = useDispatch();
  const { path } = match;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userAccounts = useSelector((state) => state.isp.userAccounts);
  const [tempUserAccs, settempUserAccs] = useState([]);
  const [selectUserAcc, setSelectedUserAcc] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [searchterm, setSearchterm] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
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

  useEffect(() => {
    settempUserAccs(userAccounts);
  }, [userAccounts]);

  const deleteUserAcc = (id, e) => {
    console.log("deleting use account");
    const userAcc = userAccounts.filter((ua) => ua.id === id)[0];
    if (userAcc) {
      setIsDeleting(true);
      setSelectedId(id);
      dispatch(globalActions.deleteUserAcc(id, userAcc));
    }
  };

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
      amount: userAcc.amount,
    };
    if (userAcc) dispatch(globalActions.updateUserAcc(id, userAccPost));
  };

  const onSearchSubmit = () => {
    if (searchterm) {
      setSearching(true);
      const filteredAccs = userAccounts.filter((userAcc) => {
        console.log(userAcc);
        return (
          userAcc.user.firstName
            .toLowerCase()
            .includes(searchterm.toLowerCase()) ||
          userAcc.user.lastName.toLowerCase().includes(searchterm.toLowerCase())
        );
      });
      settempUserAccs(filteredAccs);
      setTimeout(() => setSearching(false), 300);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchterm(e.target.value);
    if (e.target.value.trim() === "") {
      setSearching(false);
      settempUserAccs(userAccounts);
    }
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
    <Container className="useraccounts" fluid>
      <Segment className="toolbar">
        <Header floated="left" className="toolbar__header" as="h2">
          User Accounts
        </Header>
        <List floated="right" horizontal>
          <List.Item>
            <List.Content>
              <Button icon className="basicStyle">
                <Icon name="cog" /> Generate Monthly Bill
              </Button>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Button icon className="basicStyle">
                <Icon name="file excel" /> Export Data
              </Button>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Button
                className="basicStyle"
                icon
                onClick={() => {
                  setIsEdit(false);
                  setOpenAddModal(true);
                }}
              >
                <Icon name="plus" /> Add User Account
              </Button>
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
      <Segment className="Segment__noBorder noMargin paddingTopZero">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Input
            name="search"
            icon="users"
            onChange={handleSearchInputChange}
            iconPosition="left"
            loading={searching}
            placeholder="Search users..."
          />
          <Button
            className="useraccounts__search primary-button"
            icon="search"
            name="searchButton"
            onClick={onSearchSubmit}
          />
        </div>
        {!tempUserAccs.length > 0 ? (
          <Segment>
            <Message>
              <Message.Header>
                <div className="emptyUsersMessage">
                  No User Accounts for Billing :(
                  <br />
                  <p>
                    <div>
                      <Button icon className="basicStyle">
                        <Icon name="cog" /> Generate Monthly Bill
                      </Button>
                    </div>
                  </p>
                </div>
              </Message.Header>
            </Message>
          </Segment>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                {tableHeader.map((header, i) => (
                  <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tempUserAccs.map(
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
                            className="btn btn-sm basicStyle mr-1"
                          >
                            <Icon name="edit" />
                          </Button>
                          <Button
                            onClick={(e) => deleteUserAcc(id, e)}
                            icon
                            className="useraccounts__button useraccounts__button-delete"
                            disabled={isDeleting}
                            loading={isDeleting && id === selectedId}
                          >
                            <Icon name="user delete" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                }
              )}
            </Table.Body>
          </Table>
        )}
      </Segment>
    </Container>
  );
};
