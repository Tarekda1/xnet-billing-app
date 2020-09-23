import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountService } from "@/_services";
import { Loading } from "@/_components";
import { Segment, Table, Button, Icon } from "semantic-ui-react";
import { AddEdit } from "./AddEdit";
import "./List.less";

function List({ match }) {
  const { path } = match;
  const [users, setUsers] = useState([]);
  const [loading, setloading] = useState(true);
  const isVisibleRef = useRef(true);
  const [selectedUserId, setselectedUserId] = useState(-1);
  const [showModal, setshowModal] = useState(false);
  const [openDelete, setOpenDelete] = uOeState(false);

  async function fetchUser() {
    const usersFromServer = await accountService.getAll();
    if (isVisibleRef.current) {
      setUsers(usersFromServer);
      setloading(false);
    }
  }

  async function fetchUserById() {
    const updateUser = await accountService.getById(selectedUserId);
    if (updateUser) {
      let tempUsers = [...users];
      let index;
      for (let i = 0; i < tempUsers.length; i++) {
        if (tempUsers[i].id === updateUser.id) {
          index = i;
        }
      }

      tempUsers[index] = updateUser;
      setUsers(tempUsers);
    }
  }

  useEffect(() => {
    fetchUser();
    return () => {
      isVisibleRef.current = false;
    };
  }, []);

  function deleteUser(id) {
    //show confirmation before delete
    setUsers(
      users.map((x) => {
        if (x.id === id) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    accountService.delete(id).then(() => {
      setUsers((users) => users.filter((x) => x.id !== id));
    });
  }

  return (
    <Segment>
      <h1>Portal Users</h1>
      <p>All users from secure (admin only) api end point:</p>
      <Button
        icon
        className="btn basicStyle"
        onClick={(e) => {
          setselectedUserId(-1);
          setshowModal(true);
        }}
      >
        <Icon name="plus" /> Add User
      </Button>
      {loading ? (
        <Loading />
      ) : (
        <Table className="table table-striped users">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: "20%" }}>Name</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "25%" }}>
                Email
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "10%" }}>
                Is Verified
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }}>
                Created At
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }}>Role</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "40%" }} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users && users.length > 0 ? (
              users.map((user) => (
                <Table.Row className="users__row" key={user.id}>
                  <Table.Cell>
                    {user.title} {user.firstName} {user.lastName}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isVerified ? "true" : "false"}</Table.Cell>
                  <Table.Cell>{user.created}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell tyle={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Button
                        icon
                        className="basicStyle"
                        onClick={() => {
                          setselectedUserId(user.id);
                          setTimeout(() => {
                            setshowModal(true);
                          }, 100);
                        }}
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        onClick={() => deleteUser(user.id)}
                        className="basicStyle users__row-delete"
                        icon
                        loading={user.isDeleting}
                        disabled={user.role !== "Admin" || user.isDeleting}
                      >
                        <Icon name="trash" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <div>
                no users found <br />
                <Button>Add User Account</Button>
              </div>
            )}
            {!users && (
              <Table.Row>
                <td colSpan="4" className="text-center">
                  <span className="spinner-border spinner-border-lg align-center" />
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      <AddEdit
        Id={selectedUserId}
        onSave={(selectedUserId) => {
          setshowModal(false);
          //update user data
          fetchUserById(selectedUserId);
        }}
        open={showModal}
        onClose={() => setshowModal(false)}
      />
      <Confirm
        open={opendelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={onDelete}
      />
    </Segment>
  );
}

export { List };
