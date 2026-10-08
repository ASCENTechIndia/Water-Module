const multer = require('multer');

// ──────────────────────────────────────────────────────────────
// 📦 MULTER MIDDLEWARE — handles file upload from frontend
//
// memoryStorage() → file stays in RAM as a Buffer
// (we do NOT save to disk; we just read it directly)
// ──────────────────────────────────────────────────────────────

const storage = multer.memoryStorage();

const excelUpload = multer({
  storage,

  // ✅ Only allow Excel file types
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.ms-excel',                                          // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);  // ✅ Accept the file
    } else {
      cb(new Error('Only Excel files (.xls, .xlsx) are allowed!'), false); // ❌ Reject
    }
  },

  // Max file size = 10MB
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { excelUpload };
