const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");
const moment = require("moment");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
  getAllUserAccounts,
  createUserAccount,
  updateUserAccount,
  getUserAccById,
  search,
};

async function create(params) {
  // validate
  if (await db.User.findOne({ userName: params.userName })) {
    throw 'Username "' + params.username + '" is already added';
  }
  //console.log(params);
  const user = new db.User(params);

  // hash password
  user.passwordHash = hash(params.password);

  // save account
  await user.save();

  return basicDetails(user);
}

async function createPackage(params) {
  // validate
  if (await db.Package.findOne({ displayName: params.displayName })) {
    throw 'Package "' + params.displayName + '" is already added';
  }

  const package = new db.Package(params);

  // save account
  await package.save();

  return basicPackageDetails(package);
}

async function createUserAccount(params) {
  console.log(`today: ${params.billDate}`);
  // validate
  const userAcc = await db.UserAccount.findOne({
    user: params.user,
    billDate: params.billDate,
  });

  if (
    userAcc &&
    userAcc.billDate &&
    userAcc.billDate.getMonth() == params.billDate.getMonth() &&
    userAcc.billDate.getYear() == params.billDate.getYear()
  ) {
    throw (
      'User for this billDate:"' +
      moment(params.billDate, "DD-MM-YYYY") +
      '" is already added'
    );
  }
  const user = new db.UserAccount(params);

  // save account
  await user.save();

  return basicAccountDetails(user);
}

function basicPackageDetails(package) {
  const { id, displayName, created, updated } = package;
  return { id, displayName, created, updated };
}

function basicAccountDetails(userAccount) {
  console.log(userAccount);
  const { user, amount, comment, paid, billDate, id } = userAccount;
  return { user, amount, comment, paid, billDate, id };
}

function basicDetails(user) {
  console.log(JSON.stringify(user));
  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    isUserActive,
    created,
    updated,
    package,
    userName,
    password,
  } = user;
  return {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    isUserActive,
    created,
    updated,
    package,
    userName,
    password,
  };
}

async function getAll() {
  const users = await db.User.find({ isDeleted: false }).populate("package");
  return users.map((x) => basicDetails(x));
}

async function getAllUserAccounts() {
  const users = await db.UserAccount.find()
    .populate("user")
    .populate("package");
  return users.map((x) => {
    return basicAccountDetails(x);
  });
}

async function getUserAccById(id) {
  if (!db.isValidId(id)) throw "UserAcc not found";
  const userAcc = await db.UserAccount.findById(id)
    .populate("user")
    .populate("package");
  if (!userAcc) throw "User account not found";
  return userAcc;
}

async function search(searchterm) {
  if (!searchterm) {
    throw "Invalid search term";
  }

  // const userAccs = await db.UserAccount.find({
  //   $or: [
  //     {
  //       "user.firstName": { $regex: /searchterm/ },
  //       "user.lastName": { $regex: /searchterm/ },
  //       "user.phoneNumber": { $regex: /searchterm/ },
  //     },
  //   ],
  // })
  //   .populate("user")
  //   .populate("package");
  const userAccs = db.UserAccount.aggregate([
    { $unwind: "$user" },
    {
      $lookup: {
        from: "user",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $match: {
        "user.firstName": { $regex: /searchterm/ },
        "user.lastName": { $regex: /searchterm/ },
      },
    },
  ]);

  console.log(userAccs);
  if (!userAccs) throw "User account not found";
  return userAccs.map((x) => {
    return basicAccountDetails(x);
  });
}

async function getAllPackages() {
  const packages = await db.Package.find();
  return packages.map((x) => basicPackageDetails(x));
}

async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function getUser(id) {
  if (!db.isValidId(id)) throw "User not found";
  const user = await db.User.findById(id).populate("package");
  if (!user) throw "User not found";
  return user;
}

async function getPackage(id) {
  if (!db.isValidId(id)) throw "Package not found";
  const package = await db.Package.findById(id);
  if (!package) throw "Package not found";
  return package;
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  if (
    user.username !== params.username &&
    (await db.User.findOne({ username: params.username }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = hash(params.password);
  }

  // copy params to account and save
  Object.assign(user, params);
  user.updated = Date.now();
  await user.save();

  return basicDetails(user);
}

async function updateUserAccount(id, params) {
  const userAcc = await getUserAccById(id);
  console.log(userAcc);
  console.log(`params: ${params.paid}`);
  console.log(`params: ${params.amount}`);
  // copy params to account and save
  Object.assign(userAcc, params);
  userAcc.paid = params.paid;
  userAcc.amount = Number(params.amount);
  userAcc.updated = Date.now();
  await userAcc.save();

  return basicAccountDetails(userAcc);
}

async function updatePackage(id, params) {
  const package = await getPackage(id);

  // validate
  if (
    package.displayName !== params.displayName &&
    (await db.Package.findOne({ displayName: params.displayName }))
  ) {
    throw 'Display name "' + params.displayName + '" is already taken';
  }

  // copy params to account and save
  Object.assign(package, params);
  package.updated = Date.now();
  await package.save();

  return basicPackageDetails(user);
}

async function _delete(id) {
  const user = await getUser(id);
  user.isDeleted = true;
  await user.save();
}

async function deletePackage(id) {
  const pkg = await getPackage(id);
  await pkg.remove();
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}
