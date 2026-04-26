import Joi from "joi";
import { phonePattern } from "../auth/auth.validation.js";
const linkRegex = /^https?:\/\/[^\/]+\/[a-zA-Z0-9_-]+$/

export const userLinkSchema = joi.object({
    shareProfileLink: joi.string().required().pattern(linkRegex)
})


export const updateUserSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    gender: Joi.string().optional(),
    phone: Joi.string().pattern(phonePattern).optional(), 
    email: Joi.string().email().optional(), 
    age: Joi.number().optional(),
    image: Joi.string().optional()
})

