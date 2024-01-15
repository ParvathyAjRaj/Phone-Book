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

// give post with specific id
app.get("/phonebook/:id",(req,res)=>{
    const user_id = parseInt(req.params.id);
    const post = posts[user_id]
    const result = {
        "data": post,
        "length": posts.length,
    }
   // const result = posts.find((post) => post.id === user_id);
    res.json(result);
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
    const post_id = parseInt(req.body.id);
    let post_index = posts.findIndex((post) => post_id===post.id)
    const new_name = req.body.name || posts[post_index].name;
    const new_contact = req.body.contact || posts[post_index].contact;
    let updated_post = {
            id : post_id,
            name : new_name,
            contact : new_contact
        };
    posts[post_index] = updated_post;
    res.json(posts);
})

// delete the post
app.delete("/remove/:id",(req,res) => {
    let remove_id = parseInt(req.params.id);
    // splice method => splice(starting index, no of elements to be removed from starting index)
    let index = posts.findIndex((post) => post.id === remove_id);
    if(index > -1){
        posts.splice(index,1);
        res.json(posts);
    }
    else{
        res.json(posts);
    }
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})