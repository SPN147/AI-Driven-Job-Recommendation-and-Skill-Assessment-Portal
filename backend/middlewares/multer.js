// import multer from "multer";
// // multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
// const storage = multer.memoryStorage();

// export const singleUpload = multer({ storage }).single("file");  // MUST MATCH




import multer from "multer";

// Use MEMORY storage (required for file.buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const singleUpload = upload.single("file"); // export this


