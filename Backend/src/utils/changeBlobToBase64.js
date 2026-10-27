// Helper: BLOB -> Buffer
async function blobToBuffer(value) {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (typeof value.getData === "function") {
    const data = await value.getData();
    if (typeof value.destroy === "function") value.destroy();
    return data;
  }
  return null;
}

// Helper: detect file type from the first bytes of the file
function detectMimeType(buf) {
  if (!buf || buf.length < 4) return "application/octet-stream";
  if (buf.slice(0, 4).toString() === "%PDF") return "application/pdf";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "image/jpeg";
  return "application/octet-stream";
}

module.exports = { detectMimeType, blobToBuffer };
