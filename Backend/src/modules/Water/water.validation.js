
const { z } = require("zod");

const connectionMstSchema = z.object({
    in_UserId: z
        .string({
            required_error: "User ID is required",
            invalid_type_error: "User ID must be a string",
        })
        .trim()
        .min(1, "User ID is required"),

    in_ulbid: z.coerce
        .number({
            required_error: "ULB ID is required",
            invalid_type_error: "ULB ID must be a number",
        })
        .int("ULB ID must be an integer"),

    in_Mode: z.coerce
        .number({
            required_error: "Mode is required",
            invalid_type_error: "Mode must be a number",
        })
        .int("Mode must be an integer"),

    in_connid: z.coerce
        .number({
            required_error: "Connection ID is required",
            invalid_type_error: "Connection ID must be a number",
        })
        .int("Connection ID must be an integer"),

    in_wardid: z.coerce
        .number({
            required_error: "Ward ID is required",
            invalid_type_error: "Ward ID must be a number",
        })
        .int("Ward ID must be an integer"),

    in_zoneid: z.coerce
        .number({
            required_error: "Zone ID is required",
            invalid_type_error: "Zone ID must be a number",
        })
        .int("Zone ID must be an integer"),

    in_blockid: z.coerce
        .number({
            required_error: "Block ID is required",
            invalid_type_error: "Block ID must be a number",
        })
        .int("Block ID must be an integer"),

    in_srno: z.coerce
        .number({
            required_error: "Serial number is required",
            invalid_type_error: "Serial number must be a number",
        })
        .int("Serial number must be an integer"),

    in_seqno: z.coerce
        .number({
            required_error: "Sequence number is required",
            invalid_type_error: "Sequence number must be a number",
        })
        .int("Sequence number must be an integer"),

    in_connno: z
        .string({
            required_error: "Connection number is required",
            invalid_type_error: "Connection number must be a string",
        })
        .trim()
        .min(1, "Connection number is required")
        .nullable(),

    in_oldconnno: z
        .string({
            required_error: "Old connection number is required",
            invalid_type_error: "Old connection number must be a string",
        })
        .nullable(),

    in_ptnno: z
        .string({
            required_error: "PTN number is required",
            invalid_type_error: "PTN number must be a string",
        })
        .nullable(),

    in_applino: z
        .string({
            required_error: "Application number is required",
            invalid_type_error: "Application number must be a string",
        })
        .trim()
        .min(1, "Application number is required"),

    in_applidt: z
        .string({
            required_error: "Application date is required",
            invalid_type_error: "Application date must be a string",
        })
        .trim()
        .min(1, "Application date is required"),

    in_appliaprovdt: z
        .string({
            required_error: "Application approval date is required",
            invalid_type_error: "Application approval date must be a string",
        })
        .trim()
        .min(1, "Approval Date is required"),

    in_ownername: z
        .string({
            required_error: "Owner name is required",
            invalid_type_error: "Owner name must be a string",
        })
        .trim()
        .min(1, "Owner name is required"),

    in_uid: z.coerce
        .number({
            // required_error: "UID is required",
            invalid_type_error: "UID must be a number",
        })
        .int("UID must be an integer")
        .nullable(),

    in_address: z
        .string({
            required_error: "Address is required",
            invalid_type_error: "Address must be a string",
        })
        .trim()
        .min(1, "Address is required"),

    in_panno: z
        .string({
            // required_error: "PAN number is required",
            invalid_type_error: "PAN number must be a string",
        })
        .nullable(),

    in_mobno: z
        .number({
            required_error: "Mobile number is required",
            invalid_type_error: "Mobile number must be a number",
        })
        .int("Mobile number must be integer")
        .nullable(),

    in_emailid: z
        .string({
            // required_error: "Email ID is required",
            invalid_type_error: "Email ID must be a string",
        })
        .trim()
        .email("Invalid email address")
        .nullable(),

    in_statusid: z.coerce
        .number({
            required_error: "Status ID is required",
            invalid_type_error: "Status ID must be a number",
        })
        .int("Status ID must be an integer"),

    in_sequrityamt: z.coerce
        .number({
            required_error: "Security amount is required",
            invalid_type_error: "Security amount must be a number",
        })
        .finite("Security amount must be finite")
        .nonnegative("Security amount cannot be negative"),

    in_conntypeid: z.coerce
        .number({
            required_error: "Connection type is required",
            invalid_type_error: "Connection type must be a number",
        })
        .int("Connection type must be an integer"),

    in_conncodeid: z.coerce
        .number({
            required_error: "Connection code is required",
            invalid_type_error: "Connection code must be a number",
        })
        .int("Connection code must be an integer"),

    in_connsizeid: z.coerce
        .number({
            required_error: "Connection size is required",
            invalid_type_error: "Connection size must be a number",
        })
        .int("Connection size must be an integer"),

    in_connusageid: z.coerce
        .number({
            required_error: "Connection usage is required",
            invalid_type_error: "Connection usage must be a number",
        })
        .int("Connection usage must be an integer"),

    in_connusagesubid: z.coerce
        .number({
            required_error: "Connection usage subtype is required",
            invalid_type_error: "Connection usage subtype must be a number",
        })
        .int("Connection usage subtype must be an integer"),

    in_noofconn: z.coerce
        .number({
            required_error: "Number of connections is required",
            invalid_type_error: "Number of connections must be a number",
        })
        .int("Number of connections must be an integer")
        .positive("Number of connections must be greater than zero"),

    in_nooffamily: z.coerce
        .number({
            required_error: "Number of family members is required",
            invalid_type_error: "Number of family members must be a number",
        })
        .int("Number of family members must be an integer")
        .nonnegative("Number of family members cannot be negative"),

    in_consurmerid: z.coerce
        .number({
            required_error: "Consumer ID is required",
            invalid_type_error: "Consumer ID must be a number",
        })
        .int("Consumer ID must be an integer"),

    in_bulituparea: z.coerce
        .number({
            required_error: "Built-up area is required",
            invalid_type_error: "Built-up area must be a number",
        })
        .finite("Built-up area must be finite")
        .nonnegative("Built-up area cannot be negative"),

    in_meterno: z
        .string({
            required_error: "Meter number is required",
            invalid_type_error: "Meter number must be a string",
        }),

    in_metermake: z
        .string({
            required_error: "Meter make is required",
            invalid_type_error: "Meter make must be a string",
        })
        .nullable(),

    in_connownerid: z.coerce
        .number({
            required_error: "Connection owner ID is required",
            invalid_type_error: "Connection owner ID must be a number",
        })
        .int("Connection owner ID must be an integer"),

    in_insatalldt: z
        .string({
            required_error: "Installation date is required",
            invalid_type_error: "Installation date must be a string",
        }),

    in_intilreading: z.coerce
        .number({
            required_error: "Initial reading is required",
            invalid_type_error: "Initial reading must be a number",
        })
        .finite("Initial reading must be finite")
        .nonnegative("Initial reading cannot be negative"),

    in_plumberid: z.coerce
        .number({
            required_error: "Plumber ID is required",
            invalid_type_error: "Plumber ID must be a number",
        })
        .int("Plumber ID must be an integer"),

    in_conndt: z
        .string({
            required_error: "Connection date is required",
            invalid_type_error: "Connection date must be a string",
        }),

    in_billmethoid: z.coerce
        .number({
            required_error: "Billing method is required",
            invalid_type_error: "Billing method must be a number",
        })
        .int("Billing method must be an integer"),

    in_billcycleid: z.coerce
        .number({
            required_error: "Billing cycle is required",
            invalid_type_error: "Billing cycle must be a number",
        })
        .int("Billing cycle must be an integer"),

    in_arrearsamt: z.coerce
        .number({
            required_error: "Arrears amount is required",
            invalid_type_error: "Arrears amount must be a number",
        })
        .finite("Arrears amount must be finite")
        .nonnegative("Arrears amount cannot be negative"),

    in_Watertank: z.coerce
        .number({
            required_error: "Water tank value is required",
            invalid_type_error: "Water tank value must be a number",
        })
        .int("Water tank value must be an integer"),

    in_Remark: z
        .string({
            required_error: "Remark is required",
            invalid_type_error: "Remark must be a string",
        })
        .nullable(),

    in_pageno: z.coerce
        .number({
            required_error: "Page number is required",
            invalid_type_error: "Page number must be a number",
        })
        .int("Page number must be an integer"),

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

module.exports = { connectionMstSchema };
