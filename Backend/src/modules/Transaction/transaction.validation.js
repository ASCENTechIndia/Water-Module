const { z } = require("zod");

const meterReadingInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_mtrreading_Str: z
    .string({
      required_error: "Reading string is required",
      invalid_type_error: "Reading string must be a string",
    })
    .trim()
    .min(1, "Reading string is required")
    .refine(
      (val) => {
        const rows = val.split("$");
        if (rows.length === 0) return false;
        return rows.every((row) => {
          const parts = row.split("#");
          return parts.length === 6 && parts.every((p) => p.trim() !== "");
        });
      },
      {
        message:
          "Each row must have 6 #-delimited non-empty fields: ConnNo#LastReading#ReadingDate#CurrentReading#Qty#GapCodeId",
      },
    ),

  in_mtrreading_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_RedingEntryMonth: z
    .string({
      required_error: "Reading entry month is required",
      invalid_type_error: "Reading entry month must be a string",
    })
    .trim()
    .min(1, "Reading entry month is required"),

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

const billGenInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_ULBId: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_zoneid: z
    .number({
      required_error: "Zone is required",
      invalid_type_error: "Zone must be a number",
    })
    .int("Zone must be an integer"),

  in_blockno: z
    .number({
      required_error: "Block is required",
      invalid_type_error: "Block must be a number",
    })
    .int("Block must be an integer"),

  in_conno: z
    .string({
      invalid_type_error: "Connection No must be a string",
    })
    .trim()
    .optional()
    .nullable(),

  in_billdate: z
    .string({
      required_error: "Bill Date is required",
      invalid_type_error: "Bill Date must be a string",
    })
    .trim()
    .min(1, "Bill Date is required"),

  in_duedate: z
    .string({
      required_error: "Due Date is required",
      invalid_type_error: "Due Date must be a string",
    })
    .trim()
    .min(1, "Due Date is required"),

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
});

module.exports = { meterReadingInsSchema, billGenInsSchema };
