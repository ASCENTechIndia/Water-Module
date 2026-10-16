const { z } = require("zod");

const wardInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_wardid: z
    .number({
      invalid_type_error: "Ward Id must be a number",
    })
    .int("Ward Id must be an integer")
    .nullable(),

  in_wardname: z
    .string({
      required_error: "Ward name is required",
      invalid_type_error: "Ward name must be a string",
    })
    .trim()
    .min(1, "Ward name is required"),

  in_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_wardcode: z
    .string({
      required_error: "Ward code is required",
      invalid_type_error: "Ward code must be a string",
    })
    .trim()
    .min(1, "Ward code is required"),

  in_wardactiveflag: z
    .string({
      required_error: "Ward active flag is required",
      invalid_type_error: "Ward active flag must be a string",
    })
    .trim()
    .min(1, "Ward active flag is required"),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({
      required_error: "Source is required",
      invalid_type_error: "Source must be a string",
    })
    .trim()
    .min(1, "Source is required"),

  in_mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),
});

module.exports = { wardInsSchema };
