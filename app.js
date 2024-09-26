const express=require("express")
const {connectDB,getCollection}=require("./DB/mongodb")
const {model}=require("./DB/mongodb")
const path=require("path")
const bodyParser = require('body-parser');
const session=require('express-session')
const dotenv = require('dotenv');
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const connectMongodbSession = require("connect-mongodb-session")(session);
const { Collection } = require("mongoose");
// const mongoose=require('connect-mongodb-session')
// const {  default: mongoose } = require("mongoose")
const app=express()

dotenv.config();
let PORT = process.env.PORT || 3000;


app.set("view engine", "ejs")

const store=new connectMongodbSession({
    uri: process.env.uri,
    database:"User",
    collection:"Session"
})
app.use(session({
    secret:"qwerty",
    resave:false,
    saveUnitialized:false,
    store: store,
    cookie: { secure: true }
}))

const auth=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    else{
        res.send("not allowed")
    }
}
let doc;
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/hello",(req,res)=>{
    req.session.isAuth=true
    console.log(req.session.id)
    res.send("hello")
})
app.get("/create",async(req,res)=>{
    const coll = getCollection(); 
    const result = await coll.insertOne({
        email: "abc@gamail.com",
        password: "Qwer",
        age: '06-09-2024'

    
    // model.create({
    //         email:"abc@gamail.com",
    //     password:"Qwer",
    //     age:0
    //     })
    })
    res.status(201).json({ insertedId: result.insertedId });

})
    
app.get("/login",(req,res)=>{
    console.log("login called")
    res.sendFile(path.join(__dirname, '\public\\login.html'));

})

app.get("/signup",(req,res)=>{
    console.log("signup called")
    res.sendFile(path.join(__dirname,'\public\\signup.html'))
})

app.post("/signup",async(req,res)=>{
    const {email,password,dob} = req.body;
    console.log("sign up : "+email+"-"+password+"-"+dob)
    const coll = getCollection(); 

    let user=await coll.findOne({email})
    if(user){
        console.log("sign up again")
        return res.redirect("/signup")
    }

    let hash=await bcrypt.hash(password,12)
    const r=await coll.insertOne({
        email:email,
        password:hash,
        dob:dob
    })
    console.log("signup"+r.insertedId)
    res.redirect("/login")

})

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    console.log("log in : "+email+"-"+password)
    const coll = getCollection(); 
    const user=await coll.findOne({email})
    if(!user){
        console.log("log in again")

        return res.redirect("/login")
    }

    const match=await bcrypt.compare(password,user.password)

    if(!match){
        return res.redirect("/login")

    }

    req.session.isAuth=true
    req.session.user=user
    return res.redirect("/index")

    // res.send(`<h1 style="text-align: center; 
    //     margin-top: 50vh; transform: translateY(-50%);">
    //     Form submitted successfully!</h1>`);

})
    
app.get("/index",auth,async(req,res)=>{
    // res.send("index")/
    res.render("index2",{user:req.session.user})
    console.log(req.session.user)
})
app.get("/get",async(req,res)=>{
        try {
            const coll = getCollection();  // Fetch the collection after DB is connected
            const cursor = await coll.find({}).toArray();  // Use await here for async operation
            res.status(200).json(cursor);
          } catch (err) {
            res.status(500).json({ error: "Error retrieving data", details: err.message });
          }
        })

const connect=()=>{
    const client = connectDB()
    //const database=client.db("User")
    //  doc=client.collection("profile")
    // console.log("connected")
}

app.get("/logout",auth,(req,res)=>{
    req.session.destroy()
    return res.redirect("/login")
})


app.use(express.static('public'))
connect()
app.listen(3000,()=>{
console.log("listening at port 8000"+__dirname+"-----"+process.env.uri)
})