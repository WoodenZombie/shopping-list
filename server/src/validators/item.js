const Joi = require('joi');

exports.add = Joi.object({
  name: Joi.string().required(),
  listId: Joi.string().required(),
  isResolved: Joi.boolean()
});

exports.update = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  isResolved: Joi.boolean()
});

exports.resolve = Joi.object({
  id: Joi.string().required()
});

exports.remove = Joi.object({
  id: Joi.string().required()
});
