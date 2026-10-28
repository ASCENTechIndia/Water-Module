
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Place this font file inside your project's public/fonts folder.
// Download a regular Devanagari TTF font if you do not already have one.
Font.register({
  family: "NotoSansDevanagari",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    width: 842,
    height: 515,
    padding: 0,
    backgroundColor: "#FFFFFF",
    fontFamily: "NotoSansDevanagari",
    position: "relative",
  },

  receipt: {
    position: "absolute",
    left: 40,
    top: 56,
    width: 766,
    height: 369,
    borderWidth: 1.3,
    borderColor: "#000000",
  },

  header: {
    height: 46,
    borderBottomWidth: 1.3,
    borderBottomColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 65,
  },

  logo: {
    position: "absolute",
    left: 5,
    top: -32,
    width: 94,
    height: 76,
    objectFit: "contain",
  },

  corporationName: {
    fontSize: 22,
    textAlign: "center",
  },

  content: {
    paddingTop: 10,
    paddingHorizontal: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 35,
  },

  label: {
    fontSize: 15.5,
    width: 250,
  },

  colon: {
    fontSize: 15.5,
    width: 22,
    textAlign: "center",
  },

  value: {
    fontSize: 15.5,
    flexGrow: 1,
  },

  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 35,
  },

  dateLabel: {
    fontSize: 15.5,
    width: 250,
  },

  dateColon: {
    fontSize: 15.5,
    width: 22,
    textAlign: "center",
  },

  dateValue: {
    fontSize: 15.5,
    width: 178,
  },

  timeLabel: {
    fontSize: 15.5,
    width: 166,
  },

  timeColon: {
    fontSize: 15.5,
    width: 22,
    textAlign: "center",
  },

  timeValue: {
    fontSize: 15.5,
    flexGrow: 1,
  },

  helpRow: {
    flexDirection: "row",
    marginTop: 1,
  },

  helpLabel: {
    fontSize: 15.5,
    width: 250,
  },

  helpColon: {
    fontSize: 15.5,
    width: 22,
    textAlign: "center",
  },

  signature: {
    position: "absolute",
    right: 78,
    bottom: 30,
    width: 190,
    alignItems: "flex-start",
  },

  departmentName: {
    fontSize: 15.5,
    marginBottom: 8,
  },

  departmentMarathi: {
    fontSize: 15.5,
  },

  footerDate: {
    position: "absolute",
    right: 124,
    top: 433,
    fontSize: 14,
  },
});

const defaultData = {
  applicationNo: "03042026",
  applicantName: "Test Name",
  serviceName: "Re-Water Connection",
  departmentName: "WATER DEPARTMENT",
  applicationDate: "28/10/2026",
  applicationTime: "02:10:57",
  dueDate: "28/11/2026",
  dueTime: "02:10:57",
  helpLine: "",
  departmentMarathi: "मिरा-भाईंदर महानगरपालिका",
  footerDate: "28/10/2026",
};

const FieldRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.value}>{value ?? ""}</Text>
  </View>
);

const DateTimeRow = ({
  dateLabel,
  date,
  timeLabel,
  time,
}) => (
  <View style={styles.dateTimeRow}>
    <Text style={styles.dateLabel}>{dateLabel}</Text>
    <Text style={styles.dateColon}>:</Text>
    <Text style={styles.dateValue}>{date ?? ""}</Text>

    <Text style={styles.timeLabel}>{timeLabel}</Text>
    <Text style={styles.timeColon}>:</Text>
    <Text style={styles.timeValue}>{time ?? ""}</Text>
  </View>
);

export const ChangeOwnershipAckRptPDF = ({
  data = {},
  logo = "/logo.png",
  municipalText = ""
}) => {
  const receipt = { ...data };

  return (
    <Document title="Application Receipt">
      <Page
        size={[842, 515]}
        style={styles.page}
      >
        <View style={styles.receipt}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              src={logo}
              style={styles.logo}
            />

            <Text style={styles.corporationName}>
              {municipalText}
            </Text>
          </View>

          {/* Application details */}
          <View style={styles.content}>
            <FieldRow
              label="Application No/अर्ज क्र."
              value={receipt.APPLINO}
            />

            <FieldRow
              label="Applicant Name/अर्जदाराचे नाव"
              value={receipt.APPLICANTNAME}
            />

            <FieldRow
              label="Service Name/सेवेचे नाव"
              value={receipt.SERVICEMNAME}
            />

            <FieldRow
              label="Dept Name/विभागाचे नाव"
              value={receipt.DEPT_NAME}
            />

            <DateTimeRow
              dateLabel="Application Date/अर्जाची दिन"
              date={receipt.APPLIDT}
              timeLabel="Application Time/वेळ"
              time={receipt.APPLICATION_TIME}
            />

            <DateTimeRow
              dateLabel="Due Date/देय दिनांक"
              date={receipt.DUE_DATE}
              timeLabel="DueTime/वेळ"
              time={receipt.DUE_TIME}
            />

            <View style={styles.helpRow}>
              <Text style={styles.helpLabel}>
                Helpline/मदतीसाठी
              </Text>
              <Text style={styles.helpColon}>:</Text>
              <Text style={styles.value}>
                {receipt.HELPLINE}
              </Text>
            </View>
          </View>

          {/* Department signature */}
          <View style={styles.signature}>
            <Text style={styles.departmentName}>
              {receipt.DEPT_NAME}
            </Text>

            <Text style={styles.departmentMarathi}>
              {receipt.CORPORATION_NAME}
            </Text>
          </View>
        </View>

        {/* Date outside the receipt border */}
        <Text style={styles.footerDate}>
          {receipt.APPLIDT}
        </Text>
      </Page>
    </Document>
  );
};

export default ChangeOwnershipAckRptPDF;
