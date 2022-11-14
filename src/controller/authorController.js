const authorModel = require("../models/authorModel")
const validation = require('../validate/validation')

const createAuthors = async function(req, res){
    try{
        
        const{firstName, lastName, title, email, password}= req.body
        if(!(firstName&&lastName&&title&&email&&password)){
       return res.status(400).send({status:false,msg: "this data is required"})
        }
        const uniqueMail= await authorModel.findOne({email:email})
        if(uniqueMail){
            return res.status(400).send({status:false, msg:"this email is already exist"})
        }
        if ((title !== "Mr") && (title !== "Mrs") && (title !== "Miss")) {
            return res.status(400).send({ status: false, msg: "please enter correct title eg Mr,Mrs,Miss" })
        }

        if (typeof (firstName) === "string" && firstName.trim().length !== 0) {
            if (typeof (lastName) === "string" && lastName.trim().length !== 0) {
                if (typeof (email) === "string" && email.trim().length !== 0 && validation.isValidEmail(email)) {
                    if (typeof (password) === "string" && password.trim().length !== 0 && validation.isValidPassword(password)) {
                        const savedAuthorData = await authorModel.create({ firstName, lastName, title, email, password });
                        if (!savedAuthorData) {
                            return res.status(400).send({ status: false, msg: "cannot create data" })
                        }
                        return res.status(201).send({ status: true, data: savedAuthorData });
                    } else { return res.status(400).send({ status: false, data: "please provide valid password, with one upper case, one lower, one number, one special character and length should be between 8 to 16 , e.g: Pass@123" }) }
                } else { return res.status(400).send({ status: false, data: "email is invalid" }) }
            } else { return res.status(400).send({ status: false, data: "lastname is invalid" }) }
        } else { return res.status(400).send({ status: false, data: "firstame is invalid" }) }

    }
    catch{
        res.status(500).send({status:false, msg:"internal server error"})

    }}


module.exports.createAuthors= createAuthors