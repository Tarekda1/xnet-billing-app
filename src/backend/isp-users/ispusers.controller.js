const express = require("express");
const router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const Role = require("_helpers/role");
const ispUsersService = require("./ispusers.service");
const { func } = require("prop-types");

router.get("/users", authorize(Role.Admin), getAll);
router.get("/users/:id", authorize(), getById);
router.post("/users/", authorize(Role.Admin), createSchema, createUser);
router.put("/users/:id", authorize(), updateSchema, update);
router.delete("/users/:id", authorize(), _delete);
router.get("/packages", authorize(Role.Admin), getAllPackages);
router.post(
  "/packages/",
  authorize(Role.Admin),
  createPackageSchema,
  createPackage
);
router.get("/packages/:id", authorize(), getPackageById);
router.put("/packages/:id", authorize(), updatePackageSchema, updatePackage);
router.delete("/packages/:id", authorize(), deletePackage);
router.get("/accounting", authorize(Role.Admin), getAllUserAccounts);
router.get(
  "/search/:searchterm",
  authorize(Role.Admin),
  searchUserAccountByUser
);
router.post(
  "/accounting/",
  authorize(Role.Admin),
  createUserAccountSchema,
  createUserAccount
);
router.put(
  "/accounting/:id",
  authorize(),
  updateUserAccSchema,
  updateUserAccount
);

//todo
//Generate UserAccount from users table

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    address: Joi.string().empty(""),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().empty(""),
    email: Joi.string().empty(""),
    password: Joi.string().empty(""),
    userName: Joi.string().required(),
    package: Joi.objectId().required(),
  });
  validateRequest(req, next, schema);
}

function createUserAccountSchema(req, res, next) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    amount: Joi.number().required(),
    comment: Joi.string().required(),
    billDate: Joi.date(),
  });
  validateRequest(req, next, schema);
}

function createPackageSchema(req, res, next) {
  const schema = Joi.object({
    displayName: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    address: Joi.string().empty(""),
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
    package: Joi.objectId().empty(),
    userName: Joi.string().empty(""),
  };

  // only admins can update role
  if (req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty("");
  }

  const schema = Joi.object(schemaRules); //.with('password', 'confirmPassword');
  validateRequest(req, next, schema);
}

function updateUserAccSchema(req, res, next) {
  const schemaRules = {
    comment: Joi.string().empty(""),
    amount: Joi.number().empty(),
    paid: Joi.boolean().empty(),
    billDate: Joi.date().empty(),
  };

  const schema = Joi.object(schemaRules);
  validateRequest(req, next, schema);
}

function updatePackageSchema(req, res, next) {
  const schemaRules = {
    displayName: Joi.string().empty(""),
  };

  // only admins can update role
  if (req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty("");
  }

  const schema = Joi.object(schemaRules); //.with('password', 'confirmPassword');
  validateRequest(req, next, schema);
}

function createUser(req, res, next) {
  //console.log(req.body);
  ispUsersService
    .create(req.body)
    .then(() => res.json({ message: "Successfully added user" }))
    .catch(next);
}

function createUserAccount(req, res, next) {
  //console.log(`adding user account: ${req.body}`);
  ispUsersService
    .createUserAccount(req.body)
    .then(() => res.json({ message: "Successfully added user" }))
    .catch(next);
}

function createPackage(req, res, next) {
  //console.log(req.body);
  ispUsersService
    .createPackage(req.body)
    .then(() => res.json({ message: "Successfully added package" }))
    .catch(next);
}

function getAll(req, res, next) {
  ispUsersService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getAllUserAccounts(req, res, next) {
  ispUsersService
    .getAllUserAccounts()
    .then((userAccounts) => res.json(userAccounts))
    .catch(next);
}

function getAllPackages(req, res, next) {
  ispUsersService
    .getAllPackages()
    .then((packages) => res.json(packages))
    .catch(next);
}

function getById(req, res, next) {
  // admins can get any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  ispUsersService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
}

function getPackageById(req, res, next) {
  // admins can get any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  ispUsersService
    .getPackageById(req.params.id)
    .then((pkg) => (pkg ? res.json(pkg) : res.sendStatus(404)))
    .catch(next);
}

function searchUserAccountByUser(req, res, next) {
  // admins can get any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  console.log(req.params.searchterm);

  ispUsersService
    .search(req.params.searchterm)
    .then((users) => res.json(users))
    .catch(next);
}

function update(req, res, next) {
  // users can update their own account and admins can update any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log(req.body);
  ispUsersService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function updatePackage(req, res, next) {
  // users can update their own account and admins can update any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  ispUsersService
    .updatePackage(req.params.id, req.body)
    .then((pkg) => res.json(pkg))
    .catch(next);
}

function updateUserAccount(req, res, next) {
  // users can update their own account and admins can update any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //console.log(`req.body ${req.body.paid}`);
  ispUsersService
    .updateUserAccount(req.params.id, req.body)
    .then((userAcc) => res.json(userAcc))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  ispUsersService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}

function deletePackage(req, res, next) {
  // users can delete their own account and admins can delete any internet account
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  ispUsersService
    .deletePackage(req.params.id)
    .then(() => res.json({ message: "Package deleted successfully" }))
    .catch(next);
}
