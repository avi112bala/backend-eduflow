const joi=require('joi')

const materialvalidateSchema=joi.object({
    subjectId:joi.string().max(24).required(),
    title:joi.string().required().max(24),
    materialType:joi.string().valid('notes','dpp','assignment','lectureVideo').required(),
    duedate:joi.string().allow('').optional(),
    resourseUrl:joi.string().allow('').optional().uri(),
    description:joi.string().allow('').optional().max(150)
})

module.exports={materialvalidateSchema}