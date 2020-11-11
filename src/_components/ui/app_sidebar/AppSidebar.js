import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Menu, Sidebar, Image } from "semantic-ui-react";
import { accountService } from "@/_services";
import { useTranslation } from "react-i18next";
import "./AppSidebar.less";
import logo from "../../../images/xnet_logo_main.png";
import userActions from "@/_actions/userActions";
function AppSidebar(props) {
  const language = "en";
  const history = useHistory();
  const location = useLocation();
  const user = useSelector((state) => state.user.userInfo);
  const [locationPath, setlocationPath] = useState("");
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(location.pathname.slice(1));
    setlocationPath(location.pathname);
    return () => {};
  }, [location]);

  return token ? (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        direction={language === "en" ? "left" : "right"}
        vertical
        visible
        width="wide"
        className={"sidebar-wrapper"}
      >
        <Menu.Item
          as="a"
          className={locationPath === "/dashboard" ? "active" : ""}
          onClick={() => history.push("/")}
        >
          <Image src={logo} />
        </Menu.Item>
        <Menu.Item
          as="a"
          className={locationPath === "/profile" ? "active" : ""}
          onClick={() => history.push("/profile")}
        >
          <Icon name="user" />
          profile
        </Menu.Item>

        <Menu.Item
          as="a"
          className={locationPath === "/admin/users" ? "active" : ""}
          onClick={() => history.push("/admin/users")}
        >
          <Icon name="cog" />
          Admin
        </Menu.Item>
        <Menu.Item
          as="a"
          className={locationPath === "/isp-users/users" ? "active" : ""}
          onClick={() => history.push("/isp-users/users")}
        >
          <Icon name="users" />
          Internet Users
        </Menu.Item>
        <Menu.Item
          as="a"
          className={locationPath === "/isp-users/accounting" ? "active" : ""}
          onClick={() => history.push("/isp-users/accounting")}
        >
          <Icon name="calculator" />
          Accounting
        </Menu.Item>
        <Menu.Item
          as="a"
          className={locationPath === "/isp-users/login" ? "active" : ""}
          onClick={() => {
            accountService.logout(() => {
              dispatch(userActions.performLogout());
              history.push("/accounts/login");
            });
          }}
        >
          <Icon name="log out" />
          Logout
        </Menu.Item>
        {/* <Route path="/admin" component={AdminNav} /> */}
      </Sidebar>
      <Sidebar.Pusher
        style={
          language === "en" ? { marginLeft: "100px" } : { marginRight: "100px" }
        }
      >
        {props.children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  ) : (
    <div>{props.children}</div>
  );
}

export { AppSidebar };
