const Joi = require("joi");

const doubtschemavalidator=Joi.object({
    subjectId:Joi.string().required(),
    title:Joi.string().required(),
    userId:Joi.string().required(),
    doubt:Joi.string().required(),
    doubtType:Joi.string().valid('pending','resolved').default('pending'),
    media:Joi.string().allow(''),
    explaination:Joi.string().allow('').optional()
})

module.exports={doubtschemavalidator}