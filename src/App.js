import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import "./App.css";
import { Role } from "@/_helpers";
import { accountService } from "@/_services";
import { PrivateRoute, Alert } from "@/_components";
import { AppSidebar } from "@/_components/ui/AppSidebar/AppSidebar";
import { Dashboard } from "@/containers/dashboard";
import { Profile } from "@/containers/profile";
import { Account } from "@/containers/account";
import { VerifyEmail } from "@/containers/account/VerifyEmail";
import { Admin } from "@/containers/admin";
import { Provider } from "react-redux";
import { store } from "./store";
import { Login } from "@/containers/account/Login";
import { Register } from "@/containers/account/Register";
import { ISP } from "@/containers/isp";
import { TopNavigation } from "@/_components";
function App({ trans }) {
  return (
    <Provider store={store}>
      <Router>
        <AppSidebar>
          <TopNavigation i18n={trans} />
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/isp-users">
              <ISP />
            </Route>
            <Redirect from="*" to="/dashboard" />
          </Switch>
        </AppSidebar>
      </Router>
    </Provider>
  );
}

export { App };
