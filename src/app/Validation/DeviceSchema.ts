import Joi from "joi";

export const addDeviceSchema = Joi.object({
  room: Joi.required(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  energies: Joi.array().items(
    Joi.object().keys({
      is_new: Joi.boolean().required(),
      value: Joi.required(),
      time: Joi.required(),
    })
  ),
}).options({ allowUnknown: true });

export const updateDeviceSchema = Joi.object({
  room: Joi.required(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  energies: Joi.array().items(
    Joi.object().keys({
      is_new: Joi.boolean().required(),
      value: Joi.required(),
      time: Joi.required(),
    })
  ),
}).options({ allowUnknown: true });

export const deleteDevicesSchema = Joi.object({
  ids: Joi.array().min(1),
}).options({ allowUnknown: true });
