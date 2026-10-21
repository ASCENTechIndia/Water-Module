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

const ulbTipInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_ulbtipid: z
    .number({
      invalid_type_error: "Ulb Tip Id must be a number",
    })
    .int("Ulb Tip Id must be an integer")
    .nullable(),

  in_tip: z
    .string({
      required_error: "Tip is required",
      invalid_type_error: "Tip must be a string",
    })
    .trim()
    .min(1, "Tip is required"),

  in_slogan: z
    .string({
      required_error: "Slogan is required",
      invalid_type_error: "Slogan must be a string",
    })
    .trim()
    .min(1, "Slogan is required"),

  in_status: z
    .string({
      required_error: "Status is required",
      invalid_type_error: "Status must be a string",
    })
    .trim()
    .min(1, "Status is required"),

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

  in_type: z
    .string({
      required_error: "Type is required",
      invalid_type_error: "Type must be a string",
    })
    .trim()
    .min(1, "Type is required"),
});

const usageTypeInsSchema = z.object({
  in_Userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Usagetypeid: z
    .number({
      invalid_type_error: "Usage Type Id must be a number",
    })
    .int("Usage Type Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_Usagetypename: z
    .string({
      required_error: "Usage Type name is required",
      invalid_type_error: "Usage Type name must be a string",
    })
    .trim()
    .min(1, "Usage Type name is required"),

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

const consumerTypeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_ConsumerTypeTd: z
    .number({
      invalid_type_error: "Consumer Type Id must be a number",
    })
    .int("Consumer Type Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_ConsumerTypeName: z
    .string({
      required_error: "Consumer Type name is required",
      invalid_type_error: "Consumer Type name must be a string",
    })
    .trim()
    .min(1, "Consumer Type name is required"),

  in_ConsumerTypeActivelag: z
    .string({
      required_error: "Consumer Type active flag is required",
      invalid_type_error: "Consumer Type active flag must be a string",
    })
    .trim()
    .min(1, "Consumer Type active flag is required"),

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

const billFreqInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_billfreqid: z
    .number({
      invalid_type_error: "Bill Frequency Id must be a number",
    })
    .int("Bill Frequency Id must be an integer")
    .nullable(),

  in_billfreqname: z
    .string({
      required_error: "Bill Frequency name is required",
      invalid_type_error: "Bill Frequency name must be a string",
    })
    .trim()
    .min(1, "Bill Frequency name is required"),

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

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),
});

const usageSubTypeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Usagesubtypeid: z
    .number({
      invalid_type_error: "Usage Sub Type Id must be a number",
    })
    .int("Usage Sub Type Id must be an integer")
    .nullable(),

  in_Usagetypeid: z
    .number({
      required_error: "Usage Type Id is required",
      invalid_type_error: "Usage Type Id must be a number",
    })
    .int("Usage Type Id must be an integer"),

  in_mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_Usagesubtypename: z
    .string({
      required_error: "Usage Sub Type name is required",
      invalid_type_error: "Usage Sub Type name must be a string",
    })
    .trim()
    .min(1, "Usage Sub Type name is required"),

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

const gapCodeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_GapcodeId: z
    .number({
      invalid_type_error: "Gapcode Id must be a number",
    })
    .int("Gapcode Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_GapcodeName: z
    .string({
      required_error: "Gapcode name is required",
      invalid_type_error: "Gapcode name must be a string",
    })
    .trim()
    .min(1, "Gapcode name is required"),

  in_GapcodeActiveflag: z
    .string({
      required_error: "Gapcode active flag is required",
      invalid_type_error: "Gapcode active flag must be a string",
    })
    .trim()
    .min(1, "Gapcode active flag is required"),

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

const plumberInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_PlumberId: z
    .number({
      invalid_type_error: "Plumber Id must be a number",
    })
    .int("Plumber Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_PlumberName: z
    .string({
      required_error: "Plumber name is required",
      invalid_type_error: "Plumber name must be a string",
    })
    .trim()
    .min(1, "Plumber name is required"),

  in_PlumberCode: z
    .string({
      required_error: "Plumber code is required",
      invalid_type_error: "Plumber code must be a string",
    })
    .trim()
    .min(1, "Plumber code is required"),

  in_PlumberActiveflag: z
    .string({
      required_error: "Plumber active flag is required",
      invalid_type_error: "Plumber active flag must be a string",
    })
    .trim()
    .min(1, "Plumber active flag is required"),

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

const connStatusInsSchema = z.object({
  in_Userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Connstatusid: z
    .number({
      invalid_type_error: "Connection Status Id must be a number",
    })
    .int("Connection Status Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_Connstatusname: z
    .string({
      required_error: "Connection Status name is required",
      invalid_type_error: "Connection Status name must be a string",
    })
    .trim()
    .min(1, "Connection Status name is required"),

  in_connstatusactiveflag: z
    .string({
      required_error: "Connection Status active flag is required",
      invalid_type_error: "Connection Status active flag must be a string",
    })
    .trim()
    .min(1, "Connection Status active flag is required"),

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

const taxInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_taxid: z
    .number({
      invalid_type_error: "Tax Id must be a number",
    })
    .int("Tax Id must be an integer")
    .nullable(),

  in_ename: z
    .string({
      required_error: "Tax name (English) is required",
      invalid_type_error: "Tax name (English) must be a string",
    })
    .trim()
    .min(1, "Tax name (English) is required"),

  in_mname: z
    .string({
      required_error: "Tax name (Marathi) is required",
      invalid_type_error: "Tax name (Marathi) must be a string",
    })
    .trim()
    .min(1, "Tax name (Marathi) is required"),

  in_code: z
    .string({
      required_error: "Tax code is required",
      invalid_type_error: "Tax code must be a string",
    })
    .trim()
    .min(1, "Tax code is required"),

  in_owner: z
    .string({
      required_error: "Tax owner is required",
      invalid_type_error: "Tax owner must be a string",
    })
    .trim()
    .min(1, "Tax owner is required"),

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

  in_ApplyOn: z
    .number({
      required_error: "Apply On is required",
      invalid_type_error: "Apply On must be a number",
    })
    .int("Apply On must be an integer"),
});

const meterOwnerInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_MeterOwnerid: z
    .number({
      invalid_type_error: "Meter Owner Id must be a number",
    })
    .int("Meter Owner Id must be an integer")
    .nullable(),

  in_MeterOwnername: z
    .string({
      required_error: "Meter Owner name is required",
      invalid_type_error: "Meter Owner name must be a string",
    })
    .trim()
    .min(1, "Meter Owner name is required"),

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

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),
});

const connTypeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_ConntypeId: z
    .number({
      invalid_type_error: "Connection Type Id must be a number",
    })
    .int("Connection Type Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_ConntypeName: z
    .string({
      required_error: "Connection Type name is required",
      invalid_type_error: "Connection Type name must be a string",
    })
    .trim()
    .min(1, "Connection Type name is required"),

  in_conntypeactiveflag: z
    .string({
      required_error: "Connection Type active flag is required",
      invalid_type_error: "Connection Type active flag must be a string",
    })
    .trim()
    .min(1, "Connection Type active flag is required"),

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

const connCodeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_ConncodeId: z
    .number({
      invalid_type_error: "Connection Code Id must be a number",
    })
    .int("Connection Code Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_ConncodeName: z
    .string({
      required_error: "Connection Code name is required",
      invalid_type_error: "Connection Code name must be a string",
    })
    .trim()
    .min(1, "Connection Code name is required"),

  in_ConncodeActiveflag: z
    .string({
      required_error: "Connection Code active flag is required",
      invalid_type_error: "Connection Code active flag must be a string",
    })
    .trim()
    .min(1, "Connection Code active flag is required"),

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

const connSizeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Connsizeid: z
    .number({
      invalid_type_error: "Connection Size Id must be a number",
    })
    .int("Connection Size Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_Connsizename: z
    .string({
      required_error: "Connection Size name is required",
      invalid_type_error: "Connection Size name must be a string",
    })
    .trim()
    .min(1, "Connection Size name is required"),

  in_Connsizeactiveflag: z
    .string({
      required_error: "Connection Size active flag is required",
      invalid_type_error: "Connection Size active flag must be a string",
    })
    .trim()
    .min(1, "Connection Size active flag is required"),

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

const billingMethodInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_BillingMethodId: z
    .number({
      invalid_type_error: "Billing Method Id must be a number",
    })
    .int("Billing Method Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_BillingMethodName: z
    .string({
      required_error: "Billing Method name is required",
      invalid_type_error: "Billing Method name must be a string",
    })
    .trim()
    .min(1, "Billing Method name is required"),

  in_BillingMethodCode: z
    .string({
      required_error: "Billing Method code is required",
      invalid_type_error: "Billing Method code must be a string",
    })
    .trim()
    .min(1, "Billing Method code is required"),

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

const premiseTypeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_PremiseTypeId: z
    .number({
      invalid_type_error: "Premise Type Id must be a number",
    })
    .int("Premise Type Id must be an integer")
    .nullable(),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_PremiseTypeName: z
    .string({
      required_error: "Premise Type name is required",
      invalid_type_error: "Premise Type name must be a string",
    })
    .trim()
    .min(1, "Premise Type name is required"),

  in_PremisetypeActiveFlag: z
    .string({
      required_error: "Premise Type active flag is required",
      invalid_type_error: "Premise Type active flag must be a string",
    })
    .trim()
    .min(1, "Premise Type active flag is required"),

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

const collCentreInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_collcentreid: z
    .number({
      invalid_type_error: "Collection Centre Id must be a number",
    })
    .int("Collection Centre Id must be an integer")
    .nullable(),

  in_collcentrename: z
    .string({
      required_error: "Collection Centre name is required",
      invalid_type_error: "Collection Centre name must be a string",
    })
    .trim()
    .min(1, "Collection Centre name is required"),

  in_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_collcentrecode: z
    .string({
      required_error: "Collection Centre code is required",
      invalid_type_error: "Collection Centre code must be a string",
    })
    .trim()
    .min(1, "Collection Centre code is required"),

  in_collcentreactiveflag: z
    .string({
      required_error: "Collection Centre active flag is required",
      invalid_type_error: "Collection Centre active flag must be a string",
    })
    .trim()
    .min(1, "Collection Centre active flag is required"),

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

const serviceMasInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_service_id: z
    .number({
      invalid_type_error: "Service Id must be a number",
    })
    .int("Service Id must be an integer")
    .nullable(),

  in_service_ename: z
    .string({
      required_error: "Service name (English) is required",
      invalid_type_error: "Service name (English) must be a string",
    })
    .trim()
    .min(1, "Service name (English) is required"),

  in_service_mname: z
    .string({
      required_error: "Service name (Marathi) is required",
      invalid_type_error: "Service name (Marathi) must be a string",
    })
    .trim()
    .min(1, "Service name (Marathi) is required"),

  in_service_activeflag: z
    .string({
      required_error: "Service active flag is required",
      invalid_type_error: "Service active flag must be a string",
    })
    .trim()
    .min(1, "Service active flag is required"),

  in_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

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

const chargeTypeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_chargestypeid: z
    .number({
      invalid_type_error: "Charge Type Id must be a number",
    })
    .int("Charge Type Id must be an integer")
    .nullable(),

  in_chargestypename: z
    .string({
      required_error: "Charge Type name is required",
      invalid_type_error: "Charge Type name must be a string",
    })
    .trim()
    .min(1, "Charge Type name is required"),

  in_activeflag: z
    .string({
      required_error: "Active flag is required",
      invalid_type_error: "Active flag must be a string",
    })
    .trim()
    .min(1, "Active flag is required"),

  in_Orgid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

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

const accTaxInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_AccTaxid: z
    .number({
      invalid_type_error: "Acc Tax Id must be a number",
    })
    .int("Acc Tax Id must be an integer")
    .nullable(),

  in_AccTaxtaxid: z
    .string({
      required_error: "Tax Id is required",
      invalid_type_error: "Tax Id must be a string",
    })
    .trim()
    .min(1, "Tax Id is required"),

  in_AccTaxusagetype: z
    .string({
      required_error: "Usage Type is required",
      invalid_type_error: "Usage Type must be a string",
    })
    .trim()
    .min(1, "Usage Type is required"),

  in_AccTaxminorcode: z
    .string({
      required_error: "Arreas Minor Code is required",
      invalid_type_error: "Arreas Minor Code must be a string",
    })
    .trim()
    .min(1, "Arreas Minor Code is required"),

  in_AccTaxmajorcode: z
    .string({
      required_error: "Arreas Major Code is required",
      invalid_type_error: "Arreas Major Code must be a string",
    })
    .trim()
    .min(1, "Arreas Major Code is required"),

  in_AccTaxcminorcode: z
    .string({
      required_error: "Current Minor Code is required",
      invalid_type_error: "Current Minor Code must be a string",
    })
    .trim()
    .min(1, "Current Minor Code is required"),

  in_AccTaxcmajorcode: z
    .string({
      required_error: "Current Major Code is required",
      invalid_type_error: "Current Major Code must be a string",
    })
    .trim()
    .min(1, "Current Major Code is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_UlbId: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

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

const micrCodeInsSchema = z.object({
  in_userid: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_MICRCodeid: z
    .number({
      invalid_type_error: "MICR Code Id must be a number",
    })
    .int("MICR Code Id must be an integer")
    .nullable(),

  in_MICRCode: z
    .number({
      required_error: "MICR Code is required",
      invalid_type_error: "MICR Code must be a number",
    })
    .int("MICR Code must be an integer"),

  in_BankName: z
    .string({
      required_error: "Bank name is required",
      invalid_type_error: "Bank name must be a string",
    })
    .trim()
    .min(1, "Bank name is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_ulbid: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),
});

module.exports = {
  wardInsSchema,
  zoneInsSchema,
  blockInsSchema,
  bankInsSchema,
  rateInsSchema,
  ulbTipInsSchema,
  usageTypeInsSchema,
  consumerTypeInsSchema,
  billFreqInsSchema,
  usageSubTypeInsSchema,
  gapCodeInsSchema,
  plumberInsSchema,
  connStatusInsSchema,
  taxInsSchema,
  meterOwnerInsSchema,
  connTypeInsSchema,
  connCodeInsSchema,
  connSizeInsSchema,
  billingMethodInsSchema,
  premiseTypeInsSchema,
  collCentreInsSchema,
  serviceMasInsSchema,
  chargeTypeInsSchema,
  accTaxInsSchema,
  micrCodeInsSchema,
};
