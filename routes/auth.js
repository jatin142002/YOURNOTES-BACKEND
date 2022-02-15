const express = require('express');
const User = require('../models/User');

const router = express.Router();
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

// Create a user using : POST "/api/auth/createuser" . NO login required
router.post('/createuser' , [

    body('email').isEmail(),
    body('name').isLength({ min: 2 }),
    body('name').isLength({ min: 5 }),

    ] , async(req , res)=>{
    console.log("api/auth/createuser is requested !");
    console.log(req.body);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether user with this email exists already

    try
    {
        let user = await User.findOne({email : req.body.email});
        if(user)
        {
            return res.status(400).json({error : "User with this email already exists !!"});
        }

        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password , salt);
        // Creating the new user
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secpass,
        })
        
        // .then(user => res.json(user))
        // .catch(err=>{
        //     console.log(err);
        //     res.json({error : "Please enter unique email" , message : err.message})
        
    
        // const user = User(req.body); // this will save the user in database
        // user.save();
      
        // res.json([]);
        // res.send("Hello Jimmy you are in api/auth");
        res.send(req.body);
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

    
});

    
module.exports = router;