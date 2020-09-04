import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import "./App.css";
import { PrivateRoute, Alert } from "@/_components";
import { AppSidebar } from "@/_components/ui/app_sidebar/AppSidebar";
import { Dashboard } from "@/containers/dashboard";
import { Profile } from "@/containers/profile";
import { Account } from "@/containers/account";
import { Admin } from "@/containers/admin";
import { Provider } from "react-redux";
import { store } from "./store";
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
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/account">
              <Account />
            </Route>
            <PrivateRoute path="/admin">
              <Admin />
            </PrivateRoute>
            <PrivateRoute path="/isp-users">
              <ISP />
            </PrivateRoute>
            <Redirect from="*" to="/dashboard" />
          </Switch>
        </AppSidebar>
      </Router>
    </Provider>
  );
}

export { App };
