const express = require('express');
const User = require('../models/User');

const router = express.Router();
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const JWT_SECRET = "Jimmysworld";

const fetchuser = require('../middleware/fetchuser');

// ROUTE 1 : Create a user using : POST "/api/auth/createuser" . NO login required
router.post('/createuser' , [

    body('email' , "Enter a valid email").isEmail(),
    body('name' , "Enter a valid name").isLength({ min: 2 }),
    body('password' , "Password must have atleast 5 characters").isLength({ min: 5 }),

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
          password: secpass
        });

        const data = {
            user:{
                id : user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);
        
        res.json({authtoken : authtoken});
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
    
});


// ROUTE 2 : Authentication of a user using : POST "api/auth/login" .  no login required
router.post('/login' , [
    body('email','Enter the valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
    ] , async(req , res)=>{

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email, password} = req.body; // Destructuring 

    try
    {
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({error : "Please try to login with correct credentials !!" });
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({error : "Please try to login with correct credentials !!" });
        } 

        const data = {
            user:{
                id : user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);
        
        res.json({authtoken : authtoken});

    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("Internal servor error occured !!");
    }  
});


// ROUTE 3 : Get logged in user detail using : POST "api/auth/getuser".  Login required
router.post('/getuser' , fetchuser, async(req , res)=>{
    console.log("api/auth/getuser is requested !");

    userId = req.user.id;
    try
    {
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch (error)
    {
        console.error(error.message);
        res.status(500).send("Internal servor error occured !!"); 
    }

});    

module.exports = router;