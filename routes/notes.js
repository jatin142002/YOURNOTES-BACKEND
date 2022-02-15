const express = require('express');

const router = express.Router();

router.get('/' , (req , res)=>{
    console.log("api/notes is requested !");
    
    res.json([]);
})

module.exports = router;