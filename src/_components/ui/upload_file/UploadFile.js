import * as React from "react"; // eslint-disable-line
import { Button, ButtonProps, Label, Icon } from "semantic-ui-react"; // eslint-disable-line
import "./uploadfile.less";

const UploadFile = ({ button = {}, input }) => {
  let hiddenInput;
  return (
    <React.Fragment>
      <div className="uploadcontainer">
        <Button
          icon
          htmlFor={input.id}
          onClick={() => hiddenInput.click()}
          {...button}
        >
          <Icon
            className="uploadcontainer__actionicon"
            size="huge"
            name="file excel"
          />
          <label style={{ marginTop: "15px" }}>Select File</label>
        </Button>
        <input
          hidden
          ref={(el) => {
            hiddenInput = el;
          }}
          type="file"
          {...input}
        />
      </div>
    </React.Fragment>
  );
};

export { UploadFile };
