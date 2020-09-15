import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Header,
  Message,
  Segment,
  Image,
  Form,
  Button,
} from "semantic-ui-react";
import * as Yup from "yup";
import userActions from "@/_actions/userActions";
import { useTranslation } from "react-i18next";
import { accountService, alertService } from "@/_services";
import logo from "@/images/xnet_logo_main.png";

function Login({ history, location }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (token && localStorage.getItem("token")) {
      history.push("/");
    } else if (token && !localStorage.getItem("token")) {
      dispatch(userActions.performLogout());
    }
    return () => {};
  }, [token, dispatch]);

  function onSubmit() {
    setProgress(true);
    alertService.clear();
    accountService
      .login(username, password)
      .then((response) => {
        if (response && response.jwtToken) {
          const { jwtToken, ...userInfo } = response;
          dispatch(
            userActions.successfulLogin({
              token: response.jwtToken,
              info: userInfo,
            })
          );
          setProgress(false);
          const { from } = location.state || { from: { pathname: "/" } };
          history.push(from);
        }
      })
      .catch((error) => {
        setProgress(false);
        alertService.error(error);
      });
  }

  const handleReset = () => {};
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Image size="small" centered src={logo} />
        <Header as="h2" textAlign="center">
          <p>Login using ur email</p>
        </Header>
        <Segment stacked>
          <div className="card-body" />
          <Form>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              name="email"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className={"primary-button"}
              loading={progress}
              fluid
              type="submit"
              size="large"
              onClick={() => onSubmit()}
            >
              Login
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export { Login };
