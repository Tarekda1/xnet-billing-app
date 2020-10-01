import React, { useRef, useState } from "react";
import { Options } from "./Constants";
import {
  Segment,
  Table,
  Tab,
  Header,
  Container,
  Grid,
  Button,
  Checkbox,
  Icon,
  Dropdown,
  Message,
} from "semantic-ui-react";
import { UploadFile } from "@/_components/ui/upload_file/UploadFile";
import DataHelper from "@/_helpers/excel-helper";
import "./importusers.less";
import { UploadedUsers } from "../../_components";

const ImportUsers = () => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const dropDownRef = useRef(null);
  const excelHelper = new DataHelper();
  const uploadRef = useRef(null);

  const handleOnDropDownAction = (e, data) => {
    console.log(data.value);
    console.log([...selected]);
    switch (data.value) {
      case "edit":
        setIsEdit(true);
        setShowUserModel(true);
        break;
      case "delete":
        //remove selected User
        deleteSelectedUser();
        break;
    }
  };

  const handleUpload = async (e) => {
    console.log(e.target.files[0]);
    const uploadedUsersFromExcel = await excelHelper.parseExcelFile(
      e.target.files[0]
    );
    console.log(uploadedUsersFromExcel);

    setUploadedUsers(uploadedUsersFromExcel);
  };

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
                onClick={(_) => console.log("click")}
              >
                <Icon name="disk" /> Save
              </Button>
              <Button
                floated="right"
                icon
                className="userslist__action-button basicStyle"
                onClick={(_) => {
                  console.log(uploadRef);
                  uploadRef.current.click();
                }}
              >
                <Icon name="file excel" /> Import new file
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
                  options={Options}
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
        <Grid.Row>
          <Grid.Column>
            <Segment className="uploadsegment">
              <div className="uploadwrapper">
                <UploadFile
                  button={{}}
                  visible={uploadedUsers.length == 0}
                  inputRef={uploadRef}
                  input={{
                    id: "upload",
                    onInput: handleUpload,
                  }}
                />
              </div>
              <div>
                <UploadedUsers
                  headerData={uploadedUsers.shift()}
                  body={uploadedUsers}
                />
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export { ImportUsers };
