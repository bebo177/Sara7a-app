import Joi from "joi";

export const sendMessageSchmea = joi.object({
    message: Joi.striing().min(10).max(500).required().messages({
        "message.min": "message must be at leats 10 characters",
        "message.max": "message must be at most 500 characters",
    }),
    image: joi.striing().optional()
})