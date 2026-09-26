const joi=require('joi')

const studentvalidateSchema=joi.object({
    studentId:joi.string().required(),
    startDate:joi.string().required(),
    endDate:joi.string().required(),
    reason:joi.string().required(),
    status:joi.string().allow('').valid('Approved','Rejected')
})

module.exports={studentvalidateSchema}