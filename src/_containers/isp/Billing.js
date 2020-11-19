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
import parsePhoneNumber from "libphonenumber-js";
import { Loading } from "@/_components/";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/_actions/globalActions";
import ReactPaginate from "react-paginate";
import CurrencyFormat from "react-currency-format";
import { SearchBar } from "@/_components";

export const Billing = ({ match }) => {
  const dispatch = useDispatch();
  const defaultItemsPerPage = 25;
  const [itemsPerPage, setitemsPerPage] = useState(defaultItemsPerPage);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hideAddUsers, sethideAddUsers] = useState(true);
  const userAccounts = useSelector((state) => state.isp.userAccounts);
  const showLoading = useSelector((state) => state.global.showLoading);
  const [selectUserAcc, setSelectedUserAcc] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const onAddUserAccModalClose = () => {
    setOpenAddModal(false);
  };
  const onSubmitAddUserAccModel = () => {
    setOpenAddModal(false);
    //todo refresh users
    dispatch(
      globalActions.fetchInternetUserAccounts({
        pageSizeParam: itemsPerPage,
      })
    );
  };

  const onEditUserAccModal = (id) => {
    const userAcc = userAccounts.items.filter((ua) => ua.id === id)[0];
    setIsEdit(true);
    setSelectedUserAcc(userAcc);
    setOpenAddModal(true);
  };

  useEffect(() => {
    console.log("fetching user accounts");
    dispatch(
      globalActions.fetchInternetUserAccounts({
        pageSizeParam: itemsPerPage,
      })
    );
    return () => {};
  }, []);

  useEffect(() => {
    if (userAccounts && typeof userAccounts.items == "object") {
      //settempUserAccs(userAccounts.items);
      sethideAddUsers(false);
    }
  }, [userAccounts]);

  const deleteUserAcc = (id, e) => {
    console.log("deleting use account");
    const userAcc = userAccounts.items.filter((ua) => ua.id === id)[0];
    if (userAcc) {
      setIsDeleting(true);
      setSelectedId(id);
      dispatch(globalActions.deleteUserAcc(id, userAcc));
    }
  };

  const onPaidChecked = (e, id) => {
    console.log("updating use account");
    // console.log(e.checked);
    // console.log(id);
    const userAcc = userAccounts.items.filter((ua) => ua.id === id)[0];
    console.log(userAcc);
    const userAccPost = {
      paid: e.checked,
      comment: userAcc.comment,
      billDate: userAcc.billDate,
      amount: userAcc.amount,
    };
    if (userAcc) dispatch(globalActions.updateUserAcc(id, userAccPost));
  };

  const generateMonthlyBill = () => {
    let date = new Date();
    dispatch(globalActions.generateMonthlyBill({ date }));
  };

  const handlePageSubmit = (e) => {
    console.log(e);
    dispatch(
      globalActions.fetchInternetUserAccounts({
        pageSizeParam: itemsPerPage,
        pageParam: e.selected,
      })
    );
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
              <Button onClick={generateMonthlyBill} icon className="basicStyle">
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
        {/*search bar */}
        <SearchBar searchKey="userAcc" searchKeyFetch="userAccFetch" />
        <div>
          {showLoading && <Loading />}
          {userAccounts && userAccounts.items && userAccounts.items.length > 0 && (
            <Table className="ui celled striped table">
              <Table.Header>
                <Table.Row>
                  {tableHeader.map((header, i) => (
                    <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {userAccounts.items.map(
                  (
                    {
                      firstName,
                      lastName,
                      phoneNumber,
                      address,
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
                        <Table.Cell>
                          {parsePhoneNumber(phoneNumber, "LB").number}
                        </Table.Cell>
                        {/* <Table.Cell>{profile}</Table.Cell> */}
                        <Table.Cell>
                          <Checkbox
                            name="paid"
                            onChange={(e, event) => onPaidChecked(event, id)}
                            toggle
                            checked={paid}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <CurrencyFormat
                            value={amount}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"LBP"}
                          />
                        </Table.Cell>
                        <Table.Cell>{comment}</Table.Cell>
                        <Table.Cell>{billDate}</Table.Cell>
                        <Table.Cell style={{ whiteSpace: "nowrap" }}>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
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
                              disabled={isDeleting && id === selectedId}
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
        </div>
        {!showLoading &&
          userAccounts &&
          userAccounts.items &&
          userAccounts.items.length > 0 &&
          userAccounts.totalpagesCount > 1 && (
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={userAccounts.totalpagesCount}
              marginPagesDisplayed={3}
              pageRangeDisplayed={2}
              onPageChange={handlePageSubmit}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          )}

        {!showLoading &&
        !hideAddUsers &&
        userAccounts &&
        userAccounts.items.length === 0 ? (
          <Segment>
            <Message>
              <Message.Header>
                <div className="emptyUsersMessage">
                  No User Accounts for Billing :(
                  <br />
                  <div>
                    <Button
                      onClick={generateMonthlyBill}
                      icon
                      className="basicStyle"
                    >
                      <Icon name="cog" /> Generate Monthly Bill
                    </Button>
                  </div>
                </div>
              </Message.Header>
            </Message>
          </Segment>
        ) : (
          ""
        )}
      </Segment>
    </Container>
  );
};
