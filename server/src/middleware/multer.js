import multer from "multer";
export const upload = multer({
    storage:multer.memoryStorage(),
});
export default upload;