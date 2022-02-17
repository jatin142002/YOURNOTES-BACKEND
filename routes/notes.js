const express = require('express');
const Notes = require('../models/Notes');

const { body, validationResult } = require('express-validator');

const router = express.Router();

const fetchuser = require('../middleware/fetchuser');

// ROUTE 1 : Get all the notes using : GET "api/notes/fetchallnotes".  Login required
router.get('/fetchallnotes' , fetchuser , async (req , res)=>{
    try {

        console.log("api/notes/fetchallnotes is requested !");
        const notes = await Notes.find({user : req.user.id});
        res.json(notes);
        
    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal servor error occured !!");   
    }
});

// ROUTE 2 : Add a new Note using : POST "api/notes/addnote".  Login required
router.post('/addnote' , fetchuser , [

    body('title' , "Enter a valis title").isLength({ min: 3 }),
    body('description' , "Description must have atleast 5 characters").isLength({ min: 5 }),

] , async (req , res)=>{

    try {

        console.log("api/notes/addnote is requested !");

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
   
       const {title , description , tag} = req.body; // Destructuring
   
       // Creating a new note
       const note = new Notes(
           {
               title,
               description,
               tag,
               user : req.user.id 
           }
       )
   
       const savedNote = await note.save();
   
       res.json(savedNote);  
        
    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal servor error occured !!");   
    }
     
});


// ROUTE 3 : Update an existing note using : PUT "api/notes/updatenote" . Login required
router.put('/updatenote/:id' , fetchuser , async (req , res)=>{

    try {

        const {title,description,tag} = req.body;
        //Create a newNote object

        const newNote = {};
        if(title)
        {
            newNote.title = title;
        }
        if(description)
        {
            newNote.description = description;
        }
        if(tag)
        {
            newNote.tag = tag;
        }

        // Find the note to be upadted and update it..
        let note = await Notes.findById(req.params.id);

        if(!note)
        {
            return res.status(404).send("Not Found !!");
        }

        if(note.user.toString() !== req.user.id)
        {
            return res.status(401).send("Not Allowed !!");
        }

        note = await Notes.findByIdAndUpdate(req.params.id , {$set : newNote} , {new : true});
        res.json({note});

} catch (error) {
        
    console.error(error.message);
    res.status(500).send("Internal servor error occured !!");   
}

});


// ROUTE 4 : Delete an existing note using : DELETE "api/notes/deletenote" . Login required
router.delete('/deletenote/:id' , fetchuser , async (req , res)=>{

    try {
        // const {title,description,tag} = req.body;
    
        // Find the note to be deleted and delete it..
        let note = await Notes.findById(req.params.id);

        if(!note)
        {
            return res.status(404).send("Not Found !!");
        }

        // Allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id)
        {
            return res.status(401).send("Not Allowed !!");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Note has been deleted !!"});

} catch (error) {

    console.error(error.message);
    res.status(500).send("Internal servor error occured !!");         
}

});


module.exports = router;