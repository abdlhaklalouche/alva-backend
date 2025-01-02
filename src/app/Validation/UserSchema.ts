import Joi from "joi";

export const addUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  is_system_admin: Joi.boolean().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const deleteUsersSchema = Joi.object({
  ids: Joi.array().min(1),
});
