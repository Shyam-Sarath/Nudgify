const Joi = require('joi');

// Register Validation
const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  role: Joi.string().required().valid('customer', 'chef', 'admin')
});

// Login Validation
const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

// Dish Validation
const dishSchema = Joi.object({
  name: Joi.string().required().min(3),
  description: Joi.string().allow(''),
  price: Joi.number().required().positive(),
  category: Joi.string().allow(''),
  availability: Joi.boolean()
});

// Order Validation
const orderSchema = Joi.object({
  chefId: Joi.number().required(),
  items: Joi.array().items(
    Joi.object({
      dishId: Joi.number().required(),
      quantity: Joi.number().required().min(1)
    })
  ).required(),
  totalAmount: Joi.number().required().positive()
});

module.exports = {
  registerSchema,
  loginSchema,
  dishSchema,
  orderSchema
};
