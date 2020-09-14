import React, { Suspense } from "react";
import { Router } from "react-router-dom";
import ReactDOM, { render } from "react-dom";
import { history } from "./_helpers";
import { accountService } from "./_services";
import "@babel/polyfill";
import { App } from "./App";
import i18n from "./Translation";

//import './styles.less';

// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

// attempt silent token refresh before startup
// accountService.refreshToken().finally(startApp);

// function startApp() {
// ReactDOM.render(
// 	<Router history={history}>
// 		<App />
// 	</Router>,
// 	document.getElementById('app')
// );
// }

ReactDOM.render(
  <Suspense fallback={null}>
    <App trans={i18n} />
  </Suspense>,
  document.getElementById("root")
);
