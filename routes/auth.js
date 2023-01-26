const express = require("express");
const { authUser, authHash } = require("../controllers/auth");
const router = express.Router();





router.post("/", authUser);
router.post("/auth-hash", authHash);




module.exports = router;

// upload.single('file'),
// upload.array('files'),

