require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.connectionString)

const User = require("./models/userModel");
const Note = require("./models/noteModel");

const express = require("express");
const cors = require("cors")


const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");

app.use(express.json());
app.use(cors({
    origin: "https://web-notes-frontend.onrender.com/",
}))

app.get("/", (req, res)=>{
    res.json({data:"hello"});
});

//Create Account
app.post("/create-account", async (req, res)=>{
    
    const {fullName, email, password} = req.body;
    if(!fullName) {
        return res.status(400).json({error:true, message: "Full Name is required"});
    }

    if(!email) {
        return res.status(400).json({error:true, message: "Email is required"});
    }

    if(!password) {
        return res.status(400).json({error:true, message: "Password is required"});
    }

    const isUser = await User.findOne({email: email});

    if(isUser){
        return res.json({error: true, message: "User already exist"});
    }

    const user = new User({
        fullName,
        email,
        password,
    })

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error:false,
        accessToken,
        accessToken,
        message:"Registration Successful"
    });

});

app.post('/login',async (req, res)=>{
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is Required"});
    }

    if(!password){
        return res.status(400).json({message: "Password is Required"});
    }

    const user = await User.findOne({email: email});
    
    if(!user){
        return res.status(400).json({message: "User does not exist."});
    }

    if(user.password !== password ){
        return res.status(400).json({"message": "Invalid password"})
    }

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m"
    });

    return res.status(200).json({
        error: false,
        message: "Login successful",
        email,
        accessToken
    })
})

app.get('/get-user', authenticateToken, async(req,res)=>{
    const {user} = req.user;

    try{
        const userInfo = await User.findOne({_id: user._id},{fullName:1, email:1, createdOn:1});
        
        if(!user){
            return res.status(401).json({error: true, message: "User not found"});
        }
        return res.status(200).json({error: false,userInfo, message: "User found"});
    } catch(error){
        return res.status(500).json({error: true, message: "Internal server error"})
    }
})

app.post('/add-note', authenticateToken, async (req, res)=>{
    const {title, content, tags} = req.body;
    const {user} = req.user; 

    if(!title){
        return res.status(400).json({error: true, message: "Title is required"});
    }

    if(!content) {
        return res
        .status(400)
        .json({error: true, message:" Content is required"});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        //on success case
        return res.json({
            error: false,
            note,
            message:"Note added successfully",
        });
    } catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.put('/edit-note/:noteId', authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({error: true, message: "No changes are made"});
    }
    try{

        const note = await Note.findOne({_id: noteId, userId: user._id});
        
        if(!note){
            return res.status(400).json({error: true, message: "Note not found"});
        }
        
        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        
        await note.save();

        //on success
        return res.status(200).json({error:false, note, message: "Note updated Successfully"})
    } catch(error){
        console.log(error);
        return res.status(500).json({error:true, message: "Internal server error"})
    }



})


app.get("/get-all-notes", authenticateToken, async(req, res)=>{
    const {user} = req.user;

    try{
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});

        return res
            .status(200)
            .json({
                error:false,
                notes,
                message: "All Notes retrieved successfully"
            });
    } catch(error){
        return res.status(500).json({error: true, message: "Internal server error"})
    }
})

app.delete("/delete-note/:noteId", authenticateToken, async (req, res)=>{
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(400).json({error:true, message: "Note not found"})
        }

        await Note.deleteOne({_id: noteId, userId: user._id});

        return res.status(200).json({error:false, message:"Note deleted successfully"});
    } catch(error){
        return res.status(500).json({error:true, message: "Internal server error"});
    }
})

app.put('/toggle-pin/:noteId', authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(400).json({error: true, message: "Note not found"});
        }

        note.isPinned = !note.isPinned;
        
        await note.save();

        return res.status(200).json({error:false, note})

    } catch(error){
        return res.status(500).json({error: true, message: "Internal server error"})
    }
})

app.get('/search-notes', authenticateToken, async (req, res)=>{
    const {user} = req.user;
    const {search} = req.query;
    if(!search){
        return res.status(400)
            .json({ error: true, message: "Search query is required"});
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                {title: {$regex: new RegExp(search, "i") } },
                {content: {$regex: new RegExp(search, "i") } }
            ],
        })

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        return res.status(500)
            .json({
                error: true,
                message: "Internal Server Error"
            })
    }
})


app.listen(4000);

module.exports = app;
