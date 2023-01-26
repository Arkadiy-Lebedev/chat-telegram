const express = require("express");
const { getPost, getPostId, delPostId, createPost, editPost, delImgFromArrayId, delImgById } = require("../controllers/post");
const router = express.Router();
const path = require('path')
const multer = require("multer");


const storage = multer.diskStorage({  
    destination: './assets/',
  filename: (req, file, cb) => {  
      cb(null, `${file.originalname.split('.')[0]}-stop-zaim-${Date.now()}${path.extname(file.originalname)}`.toLowerCase().replace(' ', '-'))
    }
  })
  
const upload = multer({ storage })

router.get("/", getPost);

router.get("/:id", getPostId);

router.delete("/:id", delPostId);

router.post("/", upload.fields([{
    name: 'file', maxCount: 1
  }, {
    name: 'files', maxCount: 10
  }]), createPost);

  router.patch("/:id", upload.fields([{
    name: 'file', maxCount: 1
  }, {
    name: 'files', maxCount: 10
    }]), editPost);
  
router.patch("/img/:id", delImgFromArrayId);
    
router.patch("/imgsingle/:id", delImgById);


module.exports = router;

// upload.single('file'),
// upload.array('files'),

