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

req.identity = verifyToken.id
console.log(req.identity)
    next()}

catch(err){
    res.status(500).send({status:false, Error: err.message})}}


//------------------------------------------  Authorisation ----------------------------------------------------


const authorisation = async (req,res,next) => {
     try{
 const  blogId = req.params.blogId
 const query= req.query
 if(Object.keys(req.params).length==0 || Object.keys(query).length == 0){
    res.status(400).send({status:false, msg:"mandatory field does not present in the url"})}

 if(!isValidObjectId(blogId)){
    res.status(400).send({status: false, msg:"please use valid ObjectId!!"})}
 
   const fetchDetails = await blogModel.findOne({_id:blogId})
  if(!fetchDetails) 
   res.status(400).send("this blog doesn't exist")

  let authorId = fetchDetails.authorId._id
   let verifyToken= req.identity
   console.log(verifyToken)
    if(verifyToken == authorId)
     next()

else{
    res.status(403).send({status: false,msg:"You are unauthoreized to do this!!!"})}}

 catch(err){
         res.status(500).send({status:false, Error:err.message})}}
 
module.exports.authenticate = authenticate
module.exports.authorisation = authorisation