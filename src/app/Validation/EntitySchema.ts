import Joi from "joi";

export const updateEntityTypesSchema = Joi.object({
  types: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required(),
    })
  ),
});
