import React, { useState } from "react";
import { Image } from "semantic-ui-react";

const Avatar = ({ imagePath, onImageUpload }) => {
  // const [profileImage, setprofileImage] = useState("");
  // const onFileChange = (e) => {
  //   setprofileImage(e.target.files[0]);
  //   onImageUpload("profileImg", e.target.files[0]);
  // };

  return (
    <div>
      <Image
        src={
          imagePath ||
          "https://react.semantic-ui.com/images/wireframe/square-image.png"
        }
        size="medium"
        circular
      />
    </div>
  );
};

export { Avatar };
