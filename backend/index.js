const express = require('express');
require ("./db/config");
const User = require("./db/schema/userSchema")
const Product=require("./db/schema/productSchema")
const app =express();
const cors= require('cors');
const Jwt = require('jsonwebtoken');
const jwtKey = "ecommercebackend";

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
            Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
                if(err){
                    res.send("something went wrong");
                }
                res.send({user,auth:token});
            })
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

app.get("/product/:id", async(req,res)=>{
    const result = await Product.findOne({_id:req.params.id});
    if(result){
        res.send(result);
    }
    else{
        res.send("No Product Found")
    }
})

app.put("/product/:id",async(req,res)=>{
        const result=await Product.updateOne(
            {_id:req.params.id},
            {$set:req.body}
        )
        res.send(result);
})

app.get("/search/:key",async(req,res)=>{
    let result=await Product.find(
        {
            "$or" :[
                {name:{$regex:req.params.key}},
                {company:{$regex:req.params.key}},
                {category:{$regex:req.params.key}}

            ]
        });
    res.send(result);
})

app.listen(5000);