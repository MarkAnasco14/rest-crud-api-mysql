module.exports = validateRequest;

function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, //inclue all errors
    allowUnknown: true, //ignore unknown props
    stripUnknown: true, // remove all unknown props
  };

  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`validation error: ${error.details.map(x => x.message).join(", ")}`);
  } else {
    req.body = value;
    next();
  }
}
