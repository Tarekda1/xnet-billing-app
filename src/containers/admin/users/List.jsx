import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountService } from "@/_services";
import { Loading } from "@/_components";
import { Segment, Table, Button, Icon } from "semantic-ui-react";
import { AddEdit } from "./AddEdit";

function List({ match }) {
  const { path } = match;
  const [users, setUsers] = useState([]);
  const [loading, setloading] = useState(true);
  const isVisibleRef = useRef(true);
  const [selectedUserId, setselectedUserId] = useState(-1);
  const [showModal, setshowModal] = useState(false);

  async function fetchUser() {
    const usersFromServer = await accountService.getAll();
    if (isVisibleRef.current) {
      setUsers(usersFromServer);
      setloading(false);
    }
  }

  useEffect(() => {
    fetchUser();
    return () => {
      isVisibleRef.current = false;
    };
  }, [users]);

  function deleteUser(id) {
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
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">
        Add User
      </Link>
      {loading ? (
        <Loading />
      ) : (
        <Table className="table table-striped">
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
                <Table.Row key={user.id}>
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
                        className="basicbutton"
                        onClick={() => {
                          setselectedUserId(user.id);
                          setshowModal(true);
                        }}
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        onClick={() => deleteUser(user.id)}
                        className="basicbutton"
                        icon
                        loading={user.isDeleting}
                        disabled={user.isDeleting}
                      >
                        <Icon name="trash" />
                      </Button>
                      <AddEdit
                        id={selectedUserId}
                        onSave={() => setshowModal(false)}
                        open={showModal}
                      />
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
    </Segment>
  );
}

export { List };
