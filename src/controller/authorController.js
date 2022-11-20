const authorModel = require("../models/authorModel")
const validation = require('../validate/validation')
const jwt = require("jsonwebtoken")


//---------------------------------------------------- Sign Up author ----------------------------------------------



const createAuthors = async function(req, res){
    try{
        let store= req.body
        if(Object.keys(store).length==0){
            res.status(400).send({status:false, msg:"can not create author with empty body"})
        }
        const{fname, lname, title, email, password}= req.body
        if(!(fname&&lname&&title&&email&&password)){
       return res.status(400).send({status:false,msg: "this data is required"})}
       if(!validation.isValidEmail(email))
       {
        return res.status(400).send({status:false, msg:"this is not a valid emailId"})
       }
       if(!validation.isValidPassword(password))
       {return res.status(400).send({status:false, msg:"this is not a valid password"})
       }

        const uniqueMail= await authorModel.findOne({email:email})
        if(uniqueMail){
            return res.status(400).send({status:false, msg:"this email is already exist"})}

    

        if ((title !== "Mr") && (title !== "Mrs") && (title !== "Miss")) {
            return res.status(400).send({ status: false, msg: "please enter correct title eg Mr,Mrs,Miss" })}



        let details= await authorModel.create(store)
        res.status(201).send({status:true, data:details})
    }
    catch(error){
        res.status(500).send({status:false, msg:"internal server error", Error: error.messaage })}}



//---------------------------------------- Sign In ----------------------------------------------------



    const authorLogin= async function(req,res){
        try{
        let credentials=req.body
        let {email,password}=credentials
        if(Object.keys(credentials)==0){
            res.status(400).send({status:false, msg:"email and password are required"})}
        if(email.length==0|| password.length==0){
            res.status(400).send({status:false, msg:"both fields are required."})
        }

if(!validation.isValidEmail(email)){
    res.status(400).send({status:false, msg:"invalid email"})}


if(!validation.isValidPassword(password)){
    res.status(400).send({status:false, msg:"invalid password"})}


let authorDetail=await authorModel.findOne({email:email,password:password})
console.log(authorDetail._id)
if(!authorDetail){
    res.status(404).send({status:false, msg:"this author is not present at that time "})}


let token=jwt.sign({
  id:authorDetail._id,
  email:authorDetail.email,
  password:authorDetail.password
},"khul ja sim sim",{ expiresIn: '24h'})

res.setHeader("x-api-key", token)
res.status(200).send({status:true, msg:"using this token stay signed in for 24 hours" ,data:token})}
catch(error){
 res.status(500).send({status:false, msg:"internal server error", Error: error.message})
 }}



module.exports.createAuthors= createAuthors
module.exports.authorLogin=authorLogin
