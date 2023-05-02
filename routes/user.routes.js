const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {UserModel}=require("../model/user.model")


const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password}=req.body
    try{
        bcrypt.hash(password, 5, async(err, hash)=> {
            // Store hash in your password DB.
            if(err){
                res.status(400).send({msg:"register failed"})
            }else{
                let user=new UserModel({name,email,gender,password:hash})
                await user.save()
                res.status(200).send({msg:"register successfull"})

            }
        });

    }catch(err){
        res.status(400).send(err)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    const user=await UserModel.findOne({email})
    try{
        if(user){
            bcrypt.compare(password, user.password, async(err, result)=> {
                if(err){
                    res.status(400).send({msg:"login failed"})
                }else{
                    res.status(200).send({msg:"login successfull", token:jwt.sign({userID:user._id}, 'masai')})
                }
                // result == true
            });
        }else{
            res.status(200).send({msg:"please register first"})
        }

    }catch(err){
        res.status(400).send(err)
    }
})

module.exports={userRouter}