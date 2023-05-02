const express=require("express")
const jwt=require("jsonwebtoken")
const {PostModel}=require("../model/post.model")

const postRouter=express.Router()

postRouter.post("/add",async(req,res)=>{
    const token=req.headers.authorization
    const decoded = jwt.verify(token, 'masai');
    const payload=req.body;

    try{
        if(decoded){
            const user=new PostModel(payload)
            await user.save()
            res.status(200).send({msg:"new post added"})

        }else{
            res.status(400).send({msg:"please login first"})
        }

    }catch(err){
        res.status(400).send(err)
    }
})

postRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization
    const decoded = jwt.verify(token, 'masai');
    const {device,device1,device2}=req.query;
    let map={}
    if(device){
        map.device=device

    }else if(device1){
        map.device=device1

    }else if(device2){
        map.device=device2
    }
    try{
        if(decoded){
            let user=await PostModel.find({userID:decoded.userID},map)
            res.status(200).send(user)

        }else{
            res.status(400).send({msg:"please login first"})
        }

    }catch(err){
        res.status(400).send(err)
    }
})

postRouter.patch("/update/:postID",async(req,res)=>{
    const token=req.headers.authorization
    const decoded = jwt.verify(token, 'masai');

    const {postID}=req.params
    let user=await PostModel.findOne({_id:postID})
    const payload=req.body;
    try{
        if(decoded.userID==user.userID){
            await PostModel.findByIdAndUpdate({_id:postID},payload)
            res.status(200).send({msg:"post updated successfully"})

        }else{
            res.status(400).send({msg:"please login first"})
        }

    }catch(err){
        res.status(400).send(err)
    }
})

postRouter.delete("/delete/:postID",async(req,res)=>{
    const token=req.headers.authorization
    const decoded = jwt.verify(token, 'masai');

    const {postID}=req.params
    let user=await PostModel.findOne({_id:postID})

    try{
        if(decoded.userID==user.userID){
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).send({msg:"post deleted successfully"})

        }else{
            res.status(400).send({msg:"please login first"})
        }

    }catch(err){
        res.status(400).send(err)
    }
})

module.exports={postRouter}