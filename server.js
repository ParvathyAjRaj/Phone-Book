import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 2000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())

let posts=[
    {name:"Ajay",contact:"12345"},
    {name:"Parvathy",contact:"34567"},
    {name:"Vaani",contact:"56789"}
]

// give all posts 
app.get("/phonebook",(req,res)=>{
    res.json(posts);
})

// give post with specific name
app.get("/search/:name",(req,res) => {
    const name = req.params.name;
    let index = posts.findIndex((post) => post.name.toLowerCase() === name.toLowerCase())
    res.json({data : posts[index],index : index,length : posts.length});
})

// give post with specific id
app.get("/phonebook/:id",(req,res)=>{
    const user_id = parseInt(req.params.id) 
    let request_id = req.headers["request_id"] 
    // console.log("[SERVER] received request id", request_id)
    const post = posts[user_id]
    const result = {
        "data": post,
        "length": posts.length,
    }
    // console.log("result to send", result)
    res.json(result).on("error", (err)=>{
        console.log(`couldnt write post : ${err}`)
    })
})

// add new post to the list
app.post("/add",(req,res) => {
    const new_user = {
        id : parseInt(req.body.id),
        name : req.body.name,
        contact : req.body.contact
    }
    posts.push(new_user);
    res.json(posts);
})

// edit one of the posts
app.patch("/edit",(req,res)=> {
    const post_index = parseInt(req.body.index);
    const new_name = req.body.name || posts[post_index].name;
    const new_contact = req.body.contact || posts[post_index].contact;
    let updated_post = {
            name : new_name,
            contact : new_contact
        };
    posts[post_index] = updated_post;
    res.json({"data":posts[post_index],
            "length":posts.length});
})

// delete the post
app.delete("/remove/:index",(req,res) => {
    let remove_index = parseInt(req.params.index);
    // splice method => splice(starting index, no of elements to be removed from starting index)
    if(remove_index > -1){
        posts.splice(remove_index,1);
        res.json(posts);
    }
    else{
        res.json(posts);
    }
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})