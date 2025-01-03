import Joi from "joi";

export const updateEntityTypesSchema = Joi.object({
  types: Joi.array().items(
    Joi.object().keys({
      is_new: Joi.boolean().required(),
      name: Joi.string().required(),
      icon: Joi.string().required(),
    })
  ),
}).options({ allowUnknown: true });

export const addEntitySchema = Joi.object({
  user: Joi.required(),
  type: Joi.required(),
  name: Joi.string().required(),
  rooms: Joi.array().items(
    Joi.object().keys({
      is_new: Joi.boolean().required(),
      name: Joi.string().required(),
    })
  ),
}).options({ allowUnknown: true });

export const updateEntitySchema = Joi.object({
  user: Joi.required(),
  type: Joi.required(),
  name: Joi.string().required(),
  rooms: Joi.array().items(
    Joi.object().keys({
      is_new: Joi.boolean().required(),
      name: Joi.string().required(),
    })
  ),
}).options({ allowUnknown: true });

export const deleteEntitiesSchema = Joi.object({
  ids: Joi.array().min(1),
}).options({ allowUnknown: true });
