const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .strict()
      .pattern(
        /^(?=(?:.*[a-zA-Z]){3,})[a-zA-Z0-9 !@#$%^&*()_+={}\[\]:;"'<>,.?/\\-]+$/
      )

      .required()
      .messages({
        "string.base": "Title must be a string",
        "string.empty": "Title is required",
        "string.pattern.base": "Title must contain at least 3 alphabet letter",
      }),
    description: Joi.string()
      .min(20)
      .pattern(/[A-Za-z]/)
      .required()
      .messages({
        "string.base": "Description must be a string",
        "string.empty": "Description is required",
        "string.min": "Description must be at least 20 characters long",
        "string.pattern.base":
          "Description must include at least one alphabet character",
      }),
    location: Joi.string().strict().required().messages({
      "string.base": "Location must be a string",
      "string.empty": "Location is required",
    }),
    country: Joi.string()
      .strict()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.base": "Country must be a string",
        "string.empty": "Country is required",
        "string.pattern.base": "Country contain only alphabet letters",
      }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
    }),
    // image: Joi.string().allow("", null),
    image: Joi.object({
      url: Joi.string().uri().optional(),
      filename: Joi.string().optional(),
    }).optional(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string()
      .pattern(/(?:.*[a-zA-Z]){2,}/)
      .required()
      .messages({
        "string.pattern.base":
          "Comment must contain at least two alphabetic characters.",
      }),
  }).required(),
});
const bookingSchema = Joi.object({
  booking: Joi.object({
    listingId: Joi.string().required(),

    checkIn: Joi.date()
      .iso()
      .required()
      .custom((value, helpers) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (value < today) {
          return helpers.message(
            "Check-in date must be today or in the future."
          );
        }
        return value;
      }),

    checkOut: Joi.date().iso().required(),

    guests: Joi.number().required().min(1).max(10).messages({
      "number.max": "Guest limit is 10.",
      "number.min": "At least 1 guest is required.",
    }),
  }).custom((value, helpers) => {
    const checkIn = new Date(value.checkIn);
    const checkOut = new Date(value.checkOut);

    if (isNaN(checkIn) || isNaN(checkOut)) {
      return helpers.message("Invalid check-in or check-out date.");
    }

    if (checkOut < checkIn) {
      return helpers.message(
        "Check-out date must be same day or after check-in date."
      );
    }

    const diffInDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (diffInDays > 30) {
      return helpers.message("Stay cannot be longer than 30 days.");
    }

    return value;
  }),
});

module.exports = { listingSchema, reviewSchema, bookingSchema };