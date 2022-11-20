const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const blogModel = require("../models/blogModel")

//-------------------------------------------  Authentication  ----------------------------------------------------


const authenticate = async (req,res,next) => {
   try {
    const checkToken = req.headers["x-api-key"]
    let verifyToken 
        if(!checkToken) return res.status(400).send({status:false, msg:"token must be present inside the header"})
try{
    verifyToken = await jwt.verify(checkToken, "khul ja sim sim")}

   catch(err){ 
        res.status(401).send({status: false,msg:"Authentication is missing",msg2:err.message})}
req.identity= verifyToken.id

    next()}

catch(err){
    res.status(500).send({status:false, Error: err.message})}}


//------------------------------------------  Authorisation -----------------------------------------------------------------------------


const authorisation = async (req,res,next) => {
     try{
 let  blogId = req.params.blogId
 if(!blogId){
    res.status(400).send({status:false, msg:"blogId is important in path parameters"})
 }
  if(!isValidObjectId(blogId)){
 res.status(400).send({status: false, msg:"please use valid ObjectId!!"})}
 
  let details= await blogModel.findById({_id:blogId})
  id= details.authorId
  
   let verifyToken= req.identity
   
    if(verifyToken == id)
     next()

else{
    res.status(403).send({status: false,msg:"You are unauthorized to do this!!!"})}}

 catch(err){
         res.status(500).send({status:false, Error:err.message})}}


        
 
module.exports.authenticate = authenticate
module.exports.authorisation = authorisation