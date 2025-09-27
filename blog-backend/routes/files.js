import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
const router = express.Router();
const upload = multer({ dest:'uploads/' });

router.post('/upload', upload.single('file'), (req,res)=>{
  if(!req.file) return res.status(400).json({message:'No file uploaded'});
  res.json({ fileId:req.file.filename, mimeType:req.file.mimetype });
});

router.get('/:fileId', (req,res)=>{
  const filePath = path.join('uploads', req.params.fileId);
  if(!fs.existsSync(filePath)) return res.status(404).json({message:'File not found'});
  res.sendFile(path.resolve(filePath));
});

export default router;
