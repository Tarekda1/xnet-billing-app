import React, { useEffect, useState, Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { accountService } from "@/_services";

export const CheckUser = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  useEffect(() => {
    //post to check user and if not authorized redirect to login
    async function validateUser() {
      try {
        const userResp = accountService.checkUser();
        console.log(user);
        // if (!user) {
        //   history.push("/login");
        // }
        setUser(userResp);
      } catch (err) {
        console.log(err);
      }
    }
    validateUser();
    return () => {};
  }, []);
  return <Fragment></Fragment>;
};
