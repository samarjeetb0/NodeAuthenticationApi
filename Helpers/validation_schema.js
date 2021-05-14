const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    pwd: Joi.string().min(3).required(),
    phoneno: Joi.string().required()
})

const authLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    pwd: Joi.string().min(3).required()
})





module.exports = {
    authSchema,authLoginSchema
}
