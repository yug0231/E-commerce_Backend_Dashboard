const express = require('express');
require ("./db/config");
const User = require("./db/schema/userSchema")
const Product=require("./db/schema/productSchema")
const app =express();
const cors= require('cors');

app.use(cors());
app.use(express.json());
app.post("/register", async (req,res)=>{
    let user= new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})
app.post("/login", async (req,res)=>{
    let user= await User.findOne(req.body).select("-password");
    if(req.body.email && req.body.password){
        if(user){
            res.send(user);
        }
        else{
            res.send("No User found");
        }
    }
})

app.post("/add-product", async(req,res)=>{
    let product= new Product(req.body);
    product.save()
    .then((data)=>res.send(data));
})
app.listen(5000);


app.get("/products", async(req,res)=>{
    let products= await Product.find();
    if(products.length>0){
        res.send(products);
    }
    else{
        res.send("No Products Found")
    }
})

app.delete("/products/:id",async(req,res)=>{
    const result = await Product.deleteOne({_id:req.params.id});
    res.send(result);
})