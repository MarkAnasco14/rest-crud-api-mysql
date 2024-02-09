// users.controller.js

const express = require("express");
const router = express.Router();
const joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const Role = require("../_helpers/role");
const userService = require("./user-service");

// Define routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", deleteUser);

module.exports = router;

// Route handler functions
function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "User Created" }))
    .catch(next);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function deleteUser(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User Deleted" }))
    .catch(next);
}

// Schema validation middleware
function createSchema(req, res, next) {
  const schema = joi.object({
    title: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    role: joi.string().valid(Role.admin, Role.user).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  });
  validateRequest(req, res, next, schema);
}

function updateSchema(req, res, next) {
  const schema = joi
    .object({
      title: joi.string().empty(""),
      firstName: joi.string().empty(""),
      lastName: joi.string().empty(""),
      role: joi.string().valid(Role.admin, Role.user).empty(""),
      email: joi.string().email().empty(""),
      password: joi.string().min(6).empty(""),
      confirmPassword: joi.string().valid(joi.ref("password")).empty(""),
    })
    .with("password", "confirmPassword");
  validateRequest(req, res, next, schema);
}
