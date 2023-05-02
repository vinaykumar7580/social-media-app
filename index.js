const express=require("express")
const cors=require("cors")
const {connection}=require("./db")
const {userRouter}=require("./routes/user.routes")
const {postRouter}=require("./routes/post.routes")
const {auth}=require("./middleware/authentication")

const app=express()
app.use(express.json())
app.use(cors())

app.use("/users",userRouter)

app.use(auth)
app.use("/posts", postRouter)

app.listen(8080,async(req,res)=>{
    try{
        await connection
        console.log("mongodb is connected")

    }catch(err){
        console.log(err)
        console.log("mongodb not connected")
    }
    console.log("server is running on port 8080")
})