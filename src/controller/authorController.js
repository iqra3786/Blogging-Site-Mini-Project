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
        const{firstName, lastName, title, email, password}= req.body
        if(!(firstName&&lastName&&title&&email&&password)){
       return res.status(400).send({status:false,msg: "this data is required"})}

        const uniqueMail= await authorModel.findOne({email:email})
        if(uniqueMail){
            return res.status(400).send({status:false, msg:"this email is already exist"})}


        if ((title !== "Mr") && (title !== "Mrs") && (title !== "Miss")) {
            return res.status(400).send({ status: false, msg: "please enter correct title eg Mr,Mrs,Miss" })}



        if (typeof (firstName) === "string" && firstName.trim().length !== 0&& validation.isValidName(firstName)) {
            if (typeof (lastName) === "string" && lastName.trim().length !== 0&& validation.isValidName(lastName)) {
                if (typeof (email) === "string" && email.trim().length !== 0 && validation.isValidEmail(email)) {
                    if (typeof (password) === "string" && password.trim().length !== 0 && validation.isValidPassword(password)) {

                        const savedAuthorData = await authorModel.create({ 
                            firstName: firstName.replaceAll(" ", "").charAt(0).toUpperCase() + firstName.slice(1).toLowerCase().replaceAll(" ", ""), 
                            lastName:lastName.replaceAll(" ", "").charAt(0).toUpperCase() + lastName.slice(1).toLowerCase().replaceAll(" ", ""), 
                            title:title.replaceAll(" ", ""), 
                            email:email.replaceAll(" ", ""), 
                            password:password.replaceAll(" ", "") });

                        if (!savedAuthorData) {
                            return res.status(400).send({ status: false, msg: "cannot create data" })}
                        return res.status(201).send({ status: true, data: savedAuthorData });
                    } else { return res.status(400).send({ status: false, data: "please provide valid password, with one upper case, one lower, one number, one special character and length should be between 8 to 16 , e.g: Pass@123" }) }
                } else { return res.status(400).send({ status: false, data: "email is invalid" }) }
            } else { return res.status(400).send({ status: false, data: "lastname is invalid" }) }
        } else { return res.status(400).send({ status: false, data: "firstame is invalid" }) }

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
