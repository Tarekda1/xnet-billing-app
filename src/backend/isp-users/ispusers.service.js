const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");

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
};

async function create(params) {
  // validate
  if (await db.User.findOne({ username: params.username })) {
    throw 'Username "' + params.username + '" is already added';
  }
  console.log(params);
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

function basicPackageDetails(user) {
  const { id, displayName, created, updated } = user;
  return { id, displayName, created, updated };
}

function basicDetails(user) {
  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    isActive,
    created,
    updated,
    package,
  } = user;
  return {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    isActive,
    created,
    updated,
    package,
  };
}

async function getAll() {
  const users = await db.User.find({}).populate("package");
  return users.map((x) => basicDetails(x));
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
  const user = await db.User.findById(id);
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
  await user.remove();
}

async function deletePackage(id) {
  const pkg = await getPackage(id);
  await pkg.remove();
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}
