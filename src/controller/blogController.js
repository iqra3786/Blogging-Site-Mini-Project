const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");
const validation = require("../validate/validation");
const { populate } = require("../models/blogModel");
const moment = require("moment");
const { findById, findOneAndUpdate } = require("../models/authorModel");




//---------------------------------------- Blog Creation --------------------------------------------------



const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    
    // validation start
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "invalid request put valid data in body" });}

    let{body, title, authorId, category, isPublished, publishedAt, deletedAt, isDeleted}= req.body

    if(!(body&&authorId&&title&&category)){
      return res.status(400).send({status:false,msg: "this data is required"})}
    

    if (!mongoose.isValidObjectId(authorId)) {
      res.status(400).send({status: false, msg: "invalid author id"})}
let today
      if(isPublished==true){
        today= moment().format('YYYY-MM-DD, hh:mm:ss a')
 data.publishedAt=today
     }
     else if(isPublished==false){
       data.publishedAt= null
     }
     if(isDeleted==true){
       res.status(400).send({status:false, msg:"you can not delete a document from here."})
     }
     else if(isDeleted==false){
       data.deletedAt= null
     }
    //validation end

    data = await blogModel.create(data);

    return res.status(201).send({ status: true, data:data});}
      
      catch (error) {
    return res.status(500).send({ status: false, msg: error.message }) }};


//............................................................... GET API's ..............................................................................


exports.getBlog = async (req, res) => {
  try {
    if (Object.keys(req.query).length == 0) {
      let blog = await blogModel
        .find({isPublished:true, isDeleted:false})
        .populate("authorId");
      res.status(200).send({status:true, msg:"no query", msg: blog });
      if (blog.length == 0) {
        res.status(404).send({status:false, msg:"No blogs found"});}}

    if (Object.keys(req.query).length !== 0) {
      
      let filteredBlogs = await blogModel.find(req.query ).populate("authorId");
      if(filteredBlogs.length==0){
        res.status(404).send({status:false, msg:"No blogs found with these filter"})}

      return res.status(200).send({status:true, msg:"query",data: filteredBlogs });}}

     catch (error) {
    res.status(500).send({status:false, Error: error.message });}};




//.............................................................................. Update API's .............................................................
//............................................................. Update By Path Param ..............................................................................




const updateDetails = async function (req, res) {
  try {
    let blogId= req.params.blogId
   
    let data = req.body
    if(Object.keys(req.body).length==0){
      res.status(400).send({status:false, msg:"body is imprtant to update a document"})
    }
    let {isDeleted, isPublished, publishedAt, deletedAt, title, tags, category, subcategory, body}= req.body
    let today
    if(isPublished==true){
       today= moment().format('YYYY-MM-DD, hh:mm:ss a')
data.publishedAt=today
    }
    else if(isPublished==false){
      data.publishedAt= null
    }
    if(isDeleted==true){
      res.status(400).send({status:false, msg:"you can not delete a document from here."})
    }
    else if(isDeleted==false){
      data.deletedAt= null
    }

    let update= await blogModel.findOneAndUpdate({_id:blogId},
      {title:title, body:body, isPublished:isPublished, publishedAt:data.publishedAt, isDeleted:isDeleted, category:category, deletedAt:data.deletedAt, $push:{tags:tags, subcategory:subcategory}},
      {new:true})
      if(!update){
res.status(404).send({status:false, msg:'can not update this document.'})
      }
    res.status(200).send({ status: true, msg: "blog updated", data: update})
    
  }
    catch (err) {
    res.status(500).send({status:false, error: err.message })}};




//............................................................. DELETE API's ..............................................................................
//............................................................. Delete By Path Param ..............................................................................




const deleteData = async function (req, res) {
  try {
    let blogId = req.params.blogId
    
    const today= moment().format('YYYY-MM-DD, hh:mm:ss a')
    let details= await blogModel.findOneAndUpdate({_id:blogId},
{isDeleted:true, deletedAt:today},
{new : true}
    )
    if(!details){
      res.status(400).send({status:false, msg:"can not delete this document"})
    }
    res.status(200).send()
  } 
    catch (err) {
    res.status(500).send({status:false, Error:err.message});}};



//----------------------------------------------- Delete by Query Param ------------------------------------------



exports.deleteByQuery = async function (req, res) {
  try {
    const filter =req.query
    
      if(Object.keys(req.query).length==0){
        res.status(400).send({status:false, msg:"enter atleast one query."})}
       
      let findDocs= await blogModel.find(filter)

      if(findDocs.length==0){
        res.status(404).send({status:false, msg: "this blog data is not available"})
      }
      let identity= req.identity
      

      let deletedata=[]
for(let i=0; i<findDocs.length; i++){
  if(findDocs[i].authorId==identity){

             
    let detail = await blogModel.findByIdAndUpdate({_id: identity},
      
      { isDeleted: true, deletedAt: new Date() },
      
    );
    deletedata.push(detail)

  }
}
    if(!deletedata){
      return res.status(400).send({status:false, msg:"can not delete these blogs. May be they don't exist at your end!!"})}

    return res.status(200).send();}
    
    catch (err) {
    res.status(500).send({status:false, Error: err.message })}};





module.exports.createBlogs = createBlogs;
module.exports.updateDetails = updateDetails;
module.exports.deleteData = deleteData;

