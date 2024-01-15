import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port = 3000;
const API_URL = "http://localhost:2000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

// Get all posts
app.get("/phonebook",async(req,res) => {
 const response = await axios.get(`${API_URL}/phonebook`);
 res.render("open.ejs",{
    details : response.data,
    index:0
 })
})

// Get a specific post by id
app.get("/phonebook/:id",async(req,res) => {
    let id = parseInt(req.params.id);
    const response = await axios.get(`${API_URL}/phonebook/${id}`);
    let details = response.data;
    let next = `http://localhost:${port}/home`
    console.log(details);
    if(id <= details.length){
        next = `http://localhost:${port}/phonebook/${id+1}`
    }
    if (details.data){
        res.render("open.ejs",{
            details : [details.data],
            next: next,
        })
    }
    else{
        res.render("home.ejs");
    }
})

// on clicking add option in home page, go to addUser.ejs
app.get("/new",async(req,res) => {
    res.render("addUser.ejs");
})

// on clicking add button in addUser.ejs, ask server to add this user
app.post("/add",async(req,res) => {
    const response = await axios.post(`${API_URL}/add`,req.body);
    res.render("home.ejs",{
        details : response.data
    })
})

// on clicking edit option in home page, go to editUser.ejs
app.get("/edit",(req,res) => {
    res.render("editUser.ejs");
})

// on clicking edit button in editUser.ejs, ask server to edit the user
app.post("/update",async(req,res)=>{
    let req_details = {id:req.body.id,name:req.body.name,contact:req.body.contact};
    const response = await axios.patch(`${API_URL}/edit`,req_details);
    console.log(response.data);
    res.render("home.ejs",{
        details : response.data
    })
})

// on clicking delete option in home page, go to deleteUser.ejs
app.get("/del",(req,res) => {
    res.render("deleteUser.ejs")
})

// on clicking delete button in deleteUser.ejs, ask server to delete any user
app.post("/delete",async(req,res) => {
    console.log(req.body);
    let id = req.body.id;
    const response = await axios.delete(`${API_URL}/remove/${id}`);
    res.render("home.ejs",{details:response.data});
})

// Listening to the port
app.listen(port,()=>{
    console.log(`Client listening to port ${port}`);
}).on("error", function(err){console.log(`cannot start because of ${err}`)})

// Listening to the port in ip address
// app.listen(port,"192.168.1.6",()=>{
//     console.log(`Client listening to port ${port}`);
// }).on("error", function(err){console.log(`cannot start because of ${err}`)})