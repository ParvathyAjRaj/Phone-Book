import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 2000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())

let contacts=[
    {name:"Ajay",contact:"12345"},
    {name:"Parvathy",contact:"34567"},
    {name:"Vaani",contact:"56789"}
]

// give all posts 
app.get("/phonebook",(req,res)=>{
    res.json(contacts);
})

// give post with specific name
app.get("/search/:name",(req,res) => {
    const name = req.params.name;
    let index = contacts.findIndex((contact) => contact.name.toLowerCase() === name.toLowerCase())
    res.json({data : contacts[index],index : index,length : contacts.length});
})

// give post with specific id
app.get("/phonebook/:id",(req,res)=>{
    const user_id = parseInt(req.params.id) 
    let request_id = req.headers["request_id"] 
    console.log("[SERVER] received request id", request_id)
    const contact = contacts[user_id]
    const result = {
        "data": contact,
        "length": contacts.length,
    }
    // console.log("result to send", result)
    res.json(result).on("error", (err)=>{
        console.log(`couldnt write contact : ${err}`)
    })
})

// add new post to the list
app.post("/add",(req,res) => {
    const new_user = {
        id : parseInt(req.body.id),
        name : req.body.name,
        contact : req.body.contact
    }
    contacts.push(new_user);
    res.json(contacts);
})

// edit one of the posts
app.patch("/edit",(req,res)=> {
    const contact_index = parseInt(req.body.index);
    const new_name = req.body.name || contacts[contact_index].name;
    const new_contact = req.body.contact || contacts[contact_index].contact;
    let updated_post = {
            name : new_name,
            contact : new_contact
        };
    contacts[contact_index] = updated_post;
    res.json({"data":contacts[contact_index],
            "length":contacts.length});
})

// delete the post
app.delete("/remove/:index",(req,res) => {
    let remove_index = parseInt(req.params.index);
    // splice method => splice(starting index, no of elements to be removed from starting index)
    if(remove_index > -1){
        contacts.splice(remove_index,1);
        res.json(contacts);
    }
    else{
        res.json(contacts);
    }
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})