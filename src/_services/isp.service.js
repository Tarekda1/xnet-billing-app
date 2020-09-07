import config from "config";
import { fetchWrapper, history } from "@/_helpers";
import { func } from "prop-types";
// const config = {
//  apiUrl: 'http://localhost:4000'
// };
//  const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/isp-users`;

export const ispService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllPackages,
  createPackage,
  createUserAccount,
  getAllUserAccounts,
  updateUserAcc,
};

function getAllUsers() {
  return fetchWrapper.get(`${baseUrl}/users`);
}

function getAllUserAccounts() {
  return fetchWrapper.get(`${baseUrl}/accounting`);
}

function getUserById(id) {
  return fetchWrapper.get(`${baseUrl}/users/${id}`);
}

function createUser(params) {
  return fetchWrapper.post(`${baseUrl}/users`, params);
}
function createUserAccount(params) {
  return fetchWrapper.post(`${baseUrl}/accounting/`, params);
}

function createPackage(params) {
  return fetchWrapper.post(`${baseUrl}/packages`, params);
}

function updateUser(id, params) {
  return fetchWrapper.put(`${baseUrl}/users/${id}`, params).then((user) => {
    return user;
  });
}

function updateUserAcc(id, params) {
  return fetchWrapper
    .put(`${baseUrl}/accounting/${id}`, params)
    .then((userAcc) => {
      return userAcc;
    });
}

function deleteUser(id) {
  return fetchWrapper.delete(`${baseUrl}/users/${id}`).then((res) => {
    return res;
  });
}

function getAllPackages() {
  return fetchWrapper.get(`${baseUrl}/packages`);
}
