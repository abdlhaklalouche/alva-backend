import Joi from "joi";

export const updateEntityTypesSchema = Joi.object({
  types: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required(),
    })
  ),
}).options({ allowUnknown: true });

export const addEntitySchema = Joi.object({
  user_id: Joi.required(),
  type_id: Joi.required(),
  name: Joi.string().required(),
  rooms: Joi.array().items(
    Joi.object().keys({
      id: Joi.string(),
      name: Joi.string().required(),
    })
  ),
}).options({ allowUnknown: true });
