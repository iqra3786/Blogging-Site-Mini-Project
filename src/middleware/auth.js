const jwt = require("jsonwebtoken")
const blogModel = require("../models/blogModel")

const authenticate = async (req,res,next) => {
   try {
    const checkToken = req.headers["x-api-key"]
    let verifyToken 
        if(!checkToken) return res.status(400).send({msg:"token must be present inside the header"})
try{
    verifyToken = await jwt.verify(checkToken, "khul ja sim sim")
   }
   catch(err){ 
        res.status(401).send({status: false,msg:"Authentication is missing",msg2:err.message})
    }


    next()
}
catch(err){
    res.status(500).send({msg: err.message})
}
}


const authorisation = async (req,res,next) => {
    try{
  const  blogId = req.params.blogId
  const fetchDetails = await blogModel.findOne({_id:blogId})
  if(!fetchDetails){  return res.status(400).send("this blog doesn't exist")}
 
  let authorId = fetchDetails.authorId._id
  const checkToken = req.headers["x-api-key"]
  let verifyToken

    
    verifyToken = await jwt.verify(checkToken, "khul ja sim sim")
    const userLoggedIn = verifyToken.id
    if(userLoggedIn == authorId)
    next()
else{
    res.status(403).send({status: false,msg:"You are unauthoreized to do this!!!"})}
}
        

    catch(err){
        res.status(500).send({msg:err.message})
    }

 }
module.exports.authenticate = authenticate
module.exports.authorisation = authorisation