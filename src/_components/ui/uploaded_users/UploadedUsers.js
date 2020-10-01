import React, { useEffect, useState } from "react";

import { Checkbox, Tab, Table } from "semantic-ui-react";

const UploadedUsers = ({ headerData, body, enableAction }) => {
  //const header = ["username", "first name", "last name", "email", "address"];
  const [selectedIndexId, setSelectedIndexId] = useState(-1);

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {headerData &&
            headerData.length > 0 &&
            headerData.map((key, index) => (
              <Table.HeaderCell key={index}>{key}</Table.HeaderCell>
            ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {body.map((row, index) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>
                <Checkbox onChange={(e, data) => setSelectedIndexId(index)} />
              </Table.Cell>
              {row.map((col, subIndex) => {
                return <Table.Cell key={subIndex}>{col}</Table.Cell>;
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export { UploadedUsers };
