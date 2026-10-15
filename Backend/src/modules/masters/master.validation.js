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

const zoneInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_zoneid: z
    .number({
      invalid_type_error: "Zone Id must be a number",
    })
    .int("Zone Id must be an integer")
    .nullable(),

  in_zonename: z
    .string({
      required_error: "Zone name is required",
      invalid_type_error: "Zone name must be a string",
    })
    .trim()
    .min(1, "Zone name is required"),

  in_wardid: z
    .number({
      required_error: "Ward Id is required",
      invalid_type_error: "Ward Id must be a number",
    })
    .int("Ward Id must be an integer"),

  in_zonecode: z
    .string({
      required_error: "Zone code is required",
      invalid_type_error: "Zone code must be a string",
    })
    .trim()
    .min(1, "Zone code is required"),

  in_activeflag: z
    .string({
      required_error: "Active flag is required",
      invalid_type_error: "Active flag must be a string",
    })
    .trim()
    .min(1, "Active flag is required"),

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

const blockInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_blockid: z
    .number({
      invalid_type_error: "Block Id must be a number",
    })
    .int("Block Id must be an integer")
    .nullable(),

  in_blockname: z
    .string({
      required_error: "Block name is required",
      invalid_type_error: "Block name must be a string",
    })
    .trim()
    .min(1, "Block name is required"),

  in_zoneid: z
    .number({
      required_error: "Zone Id is required",
      invalid_type_error: "Zone Id must be a number",
    })
    .int("Zone Id must be an integer"),

  in_blockcode: z
    .string({
      required_error: "Block code is required",
      invalid_type_error: "Block code must be a string",
    })
    .trim()
    .min(1, "Block code is required"),

  in_activeflag: z
    .string({
      required_error: "Active flag is required",
      invalid_type_error: "Active flag must be a string",
    })
    .trim()
    .min(1, "Active flag is required"),

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

const bankInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_bankid: z
    .number({
      invalid_type_error: "Bank Id must be a number",
    })
    .int("Bank Id must be an integer")
    .nullable(),

  in_bankname: z
    .string({
      required_error: "Bank name is required",
      invalid_type_error: "Bank name must be a string",
    })
    .trim()
    .min(1, "Bank name is required"),

  in_Orgid: z
    .number({
      required_error: "Org Id is required",
      invalid_type_error: "Org Id must be a number",
    })
    .int("Org Id must be an integer"),

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

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),
});

const rateInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_UsageTypeId: z
    .number({
      required_error: "Usage Type Id is required",
      invalid_type_error: "Usage Type Id must be a number",
    })
    .int("Usage Type Id must be an integer"),

  in_UsageSubTypeId: z
    .number({
      required_error: "Usage Sub Type Id is required",
      invalid_type_error: "Usage Sub Type Id must be a number",
    })
    .int("Usage Sub Type Id must be an integer"),

  in_conntypeid: z
    .number({
      required_error: "Connection Type Id is required",
      invalid_type_error: "Connection Type Id must be a number",
    })
    .int("Connection Type Id must be an integer"),

  in_connsizeid: z
    .number({
      required_error: "Connection Size Id is required",
      invalid_type_error: "Connection Size Id must be a number",
    })
    .int("Connection Size Id must be an integer"),

  in_valuetype: z
    .string({
      required_error: "Value type is required",
      invalid_type_error: "Value type must be a string",
    })
    .trim()
    .min(1, "Value type is required"),

  in_frmdt: z
    .string({
      required_error: "From date is required",
      invalid_type_error: "From date must be a string",
    })
    .trim()
    .min(1, "From date is required"),

  in_todt: z
    .string({
      required_error: "To date is required",
      invalid_type_error: "To date must be a string",
    })
    .trim()
    .min(1, "To date is required"),

  in_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_Rate_Str: z
    .string({
      required_error: "Rate string is required",
      invalid_type_error: "Rate string must be a string",
    })
    .trim()
    .min(1, "Rate string is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_TaxId: z
    .number({
      required_error: "Tax Id is required",
      invalid_type_error: "Tax Id must be a number",
    })
    .int("Tax Id must be an integer"),

  in_ipaddr: z
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
});

module.exports = {
  wardInsSchema,
  zoneInsSchema,
  blockInsSchema,
  bankInsSchema,
  rateInsSchema,
};
