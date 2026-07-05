import multer from "multer";
import express from 'express'

const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

export default upload;