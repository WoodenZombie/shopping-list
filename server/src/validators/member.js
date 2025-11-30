const Joi = require('joi');

exports.add = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('owner', 'member', 'admin').required(),
  listId: Joi.string().required()
});

exports.remove = Joi.object({
  userId: Joi.string().required(),
  listId: Joi.string().required()
});
