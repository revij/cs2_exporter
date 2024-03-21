const Joi = require('joi');

const metricsParamsSchema = Joi.object({
    ip: [Joi.string().hostname().required(), Joi.string().ip().required()],
    port: Joi.number().integer().min(1).max(65535).required(),
    password: Joi.string().required(),
});

module.exports = {
    metricsParamsSchema
}
