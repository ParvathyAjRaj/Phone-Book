import express, { request } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const app=express();
const port = 3000;
const API_URL = "http://localhost:2000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

// Get all posts
app.get("/phonebook",async(req,res) => {
 const response = await axios.get(`${API_URL}/phonebook`);
 res.render("summary.ejs",{
    details : response.data,
 })
})

// on clicking search button from home page, go to search.ejs
app.get("/search",(req,res)=>{
    res.render("search.ejs");
});


// on clicking search button in search.ejs, ask server to search this name
app.get("/search_name",async(req,res) => {
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
            res.render("open.ejs",{
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
    
    
})

// Get a specific post by id
app.get("/phonebook/:index",async(req,res) => {
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
        res.render("open.ejs",{
            details : [details.data],
            next: next,
            back:back,
            index : index
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
app.get("/edit/:index",async(req,res) => {
    let index = parseInt(req.params.index);
    let request_id = uuidv4()
    // console.log("[CLIENT] getting phonebook by id", id, request_id)
    const response = await axios.get(`${API_URL}/phonebook/${index}`, {
        headers:{
            "request_id" : request_id
        }
    });
    let details = response.data;
    // console.log("[CLIENT] obtained phonebook by id", details, request_id)
    res.render("editUser.ejs",{
        details:[details.data],
        index : index
    });
})

// on clicking edit button in editUser.ejs, ask server to update the user
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
    res.render("open.ejs",{
        details : [details],
        index:index,
        back:back,
        next:next
    })
})

// on clicking delete button in open.ejs, ask server to delete any user
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