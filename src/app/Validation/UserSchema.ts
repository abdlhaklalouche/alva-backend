import Joi from "joi";

export const addUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  is_system_admin: Joi.boolean().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
}).options({ allowUnknown: true });

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  is_system_admin: Joi.boolean().required(),
  email: Joi.string().email().required(),
  password: Joi.string().optional().allow("").min(6).max(30),
}).options({ allowUnknown: true });

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
}).options({ allowUnknown: true });

export const accountUsersSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().optional().allow("").min(6).max(30),
}).options({ allowUnknown: true });

export const deleteUsersSchema = Joi.object({
  ids: Joi.array().min(1),
}).options({ allowUnknown: true });
