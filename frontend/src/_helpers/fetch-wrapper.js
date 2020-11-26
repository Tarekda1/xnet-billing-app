import config from "config";
import { accountService } from "@/_services";
import { history } from "./history";
import { getToken } from "./utility";

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
  putForm,
};

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    credentials: "include",
    body: JSON.stringify(body),
  };
  console.log(authHeader(url));
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body, options) {
  console.log(body);
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(url),
      ...options,
    },
    body: JSON.stringify(body),
  };
  if (body.headers["Content-Type"] == "multipart/form-data") {
    requestOptions = { ...requestOptions, body: body };
  }
  return fetch(url, requestOptions).then(handleResponse);
}

function putForm(url, body, options) {
  console.log(body);
  const requestOptions = {
    method: "PUT",
    headers: {
      ...authHeader(url),
      ...options,
    },
    body: body,
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = getToken();
  //const isLoggedIn = user && user.jwtToken;
  const isApiUrl = url.startsWith(config.apiUrl);
  if (token && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      //&& accountService.userValue
      if ([401, 403].includes(response.status) && getToken() != null) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        return accountService.logout();
      } else if ([401, 403].includes(response.status) && getToken() == null) {
        history.push("./login");
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
