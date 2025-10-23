const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            success: false,
            message: "Validation error.",
            errors: errors,
            data: null
        });
    }
    req.body = value;
    next();
};

module.exports = validate;