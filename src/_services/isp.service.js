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
  createBatchUsers,
  deleteUser,
  getAllPackages,
  createPackage,
  createUserAccount,
  getAllUserAccounts,
  updateUserAcc,
  searchUserAccount,
  deleteUserAcc,
  generateMonthlyBillForUser,
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

function createBatchUsers(params) {
  return fetchWrapper.post(`${baseUrl}/users/batchUsers`, params);
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
  console.log(params);
  return fetchWrapper
    .put(`${baseUrl}/accounting/${id}`, params)
    .then((userAcc) => {
      return userAcc;
    });
}
function deleteUserAcc(id) {
  return fetchWrapper.delete(`${baseUrl}/accounting/${id}`).then((res) => {
    return res;
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

/**
 * Generate list of user accounts for billing for the date sent(month and year)
 * unique users are added for unique month and year
 * @param {*} date
 * @returns list of generated user accounts
 */
function generateMonthlyBillForUser(date) {
  return fetchWrapper.get(`${baseUrl}/generateMonthlyBill`);
}

function searchUserAccount(user) {
  return fetchWrapper.get(`${baseUrl}/search/${user}`);
}
