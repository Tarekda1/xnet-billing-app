import React, { useEffect } from "react";
import {
  Route,
  Switch,
  BrowserRouter,
  Redirect,
  useRouteMatch,
} from "react-router-dom";

import { Users } from "./Users";
import { Package } from "./Package";
import { Billing } from "./Billing";
import { ImportUsers } from "./ImportUsers";

function ISP(props) {
  let { path, url } = useRouteMatch();
  console.log(path);

  return (
    <div
      className="container"
      style={{ overflow: "auto", overflowY: "scroll" }}
    >
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <div className="card m-3">
            <Switch>
              <Route exact path={`${path}/`} component={Users} />
              <Route path={`${path}/users`} component={Users} />
              <Route path={`${path}/package`} component={Package} />
              <Route path={`${path}/accounting`} component={Billing} />
              <Route path={`${path}/importusers`} component={ImportUsers} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ISP };
