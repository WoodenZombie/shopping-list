const Joi = require('joi');

exports.create = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  ownerId: Joi.string().required(),
  members: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('owner', 'member', 'admin').required()
  })),
  items: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    isResolved: Joi.boolean()
  }))
});

exports.update = Joi.object({
  name: Joi.string().min(1).max(255),
  isArchived: Joi.boolean()
});
