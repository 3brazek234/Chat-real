const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 50 characters.",
    "string.empty": "Username is required.",
    "any.required": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
