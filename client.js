import express, { request } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const app=express();
const port = 3000;
const API_URL = "http://localhost:2000";

// middleware
function requestId(req,res,next){
    let request_id = uuidv4();
    req.headers.request_id = request_id; 
    next();
}

app.use(requestId);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

// Get all posts
app.get("/phonebook",async(req,res) => {
    try{
        const response = await axios.get(`${API_URL}/phonebook`);
        res.render("contactList.ejs",{
        details : response.data,
        })
    }catch(err){
        if (err.code === "ECONNREFUSED"){
            res.render("connectionRefused.ejs");
        }
    }
 
})

// on clicking search button from home page, go to contactList.ejs
app.get("/search",(req,res)=>{
    res.render("search.ejs");
});


// on clicking search button in contactList.ejs, ask server to search this name
app.get("/search_name",async(req,res) => {
    try{
        let name = req.query.name;
        if(name){
            const response = await axios.get(`${API_URL}/search/${name}`);
            const data = response.data.data;
            const index = response.data.index;
            const length = response.data.length;
            let next = `http://localhost:${port}/home`
            let back = `http://localhost:${port}/home`
            if(index <= length){
                next = `http://localhost:${port}/phonebook/${index+1}`
                if (index > 0){
                    back = `http://localhost:${port}/phonebook/${index-1}`
                }
            }
            if (data){
                res.render("openBook.ejs",{
                    details : [data],
                    next: next,
                    back:back,
                    index : index
                })
            }
            else{
                res.render("no_result.ejs");
            }
        }
        else{
            res.render("no_result.ejs");
        }
    }catch(err){
        if (err.code === "ECONNREFUSED"){
            res.render("connectionRefused.ejs");
        }
    }   
    
})

// Get a specific post by id
app.get("/phonebook/:index",async(req,res) => {
    try{
        let index = parseInt(req.params.index);
        const response = await axios.get(`${API_URL}/phonebook/${index}`);
        let details = response.data;
        let next = `http://localhost:${port}/home`
        let back = `http://localhost:${port}/home`
        if(index <= details.length){
            next = `http://localhost:${port}/phonebook/${index+1}`
            if (index > 0){
                back = `http://localhost:${port}/phonebook/${index-1}`
            }
        }
        if (details.data){
            res.render("openBook.ejs",{
                details : [details.data],
                next: next,
                back:back,
                index : index
            })
        }
        else{
            res.render("home.ejs");
        }
    }catch(err){
        if (err.code === "ECONNREFUSED"){
            res.render("connectionRefused.ejs");
        }
    }
})

// on clicking add option in home page, go to addContact.ejs
app.get("/new",async(req,res) => {
    res.render("addContact.ejs");
})

// on clicking add button in addContact.ejs, ask server to add this user
app.post("/add",async(req,res) => {
    try{
        const response = await axios.post(`${API_URL}/add`,req.body);
        res.render("home.ejs",{
            details : response.data
        })
    }catch(err){
        if (err.code === "ECONNREFUSED"){
            res.render("connectionRefused.ejs");
        }
    }
    
})

// on clicking edit option in home page, go to editContact.ejs
app.get("/edit/:index",async(req,res) => {
    let index = parseInt(req.params.index);
    // console.log("[CLIENT] getting phonebook by index", index,  req.headers.request_id)
    const response = await axios.get(`${API_URL}/phonebook/${index}`, {
        headers:{
            "request_id" : req.headers.request_id
        }
    });
    let details = response.data;
    res.render("editContact.ejs",{
        details:[details.data],
        index : index
    });
})

// on clicking edit button in editContact.ejs, ask server to update the user
app.post("/update/:index",async(req,res)=>{
    let index = parseInt(req.params.index);
    let req_details = {name:req.body.name,contact:req.body.contact,index:index};
    const response = await axios.patch(`${API_URL}/edit`,req_details);
    const details = response.data.data;
    const length = response.data.length;
    let next = `http://localhost:${port}/home`
    let back = `http://localhost:${port}/home`
    if(index <= length){
        next = `http://localhost:${port}/phonebook/${index+1}`
        if (index > 0){
            back = `http://localhost:${port}/phonebook/${index-1}`
        }
    }
    res.render("openBook.ejs",{
        details : [details],
        index:index,
        back:back,
        next:next
    })
})

// on clicking delete button in openBook.ejs, ask server to delete any user
app.get("/delete/:index",async(req,res) => {
    let index = parseInt(req.params.index);
    const response = await axios.delete(`${API_URL}/remove/${index}`);
    res.render("home.ejs")
})

// Listening to the port
app.listen(port,()=>{
    console.log(`Client listening to port ${port}`);
}).on("error", function(err){console.log(`cannot start because of ${err}`)})

// Listening to the port in ip address
// app.listen(port,"192.168.1.6",()=>{
//     console.log(`Client listening to port ${port}`);
// }).on("error", function(err){console.log(`cannot start because of ${err}`)})