import * as React from "react"; // eslint-disable-line
import { Button, ButtonProps, Label, Icon } from "semantic-ui-react"; // eslint-disable-line
import "./uploadfile.less";

const UploadFile = ({
  button = {},
  input,
  size = "small",
  showbutton = true,
  showicon = true,
  labelText = "Select File",
  showLabel = true,
  inputRef,
  iconName = "file excel",
  visible = true,
  onFileUpload,
}) => {
  let hiddenInput;
  return (
    <React.Fragment>
      <div className="uploadcontainer" hidden={!visible}>
        <Button
          icon
          htmlFor={input.id}
          onClick={(e) => {
            e.preventDefault();
            hiddenInput.click();
          }}
          {...button}
        >
          {showicon && (
            <Icon
              className="uploadcontainer__actionicon"
              size={size}
              name={iconName}
            />
          )}
          <label hidden={!showLabel} style={{ marginTop: "15px" }}>
            {labelText}
          </label>
        </Button>
        <input
          hidden
          ref={(el) => {
            hiddenInput = el;
            inputRef.current = el;
          }}
          type="file"
          onChange={(event) => {
            if (onFileUpload) {
              const imagePath = URL.createObjectURL(event.target.files[0]);
              console.log(imagePath);
              onFileUpload(event.target.files[0], imagePath);
            }
          }}
          {...input}
        />
      </div>
    </React.Fragment>
  );
};

export { UploadFile };
