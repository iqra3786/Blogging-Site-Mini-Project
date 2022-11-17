const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");
const validation = require("../validate/validation");
const { populate } = require("../models/blogModel");
const moment = require("moment");

//---------------------------------------- Blog Creation --------------------------------------------------

const createBlogs = async function (req, res) {
  try {
    let data = ({
      title,
      body,
      authorId,
      category,
      tags,
      subcategory,
      isPublished,
    } = req.body);
    
    // validation start
    if(!(body&&authorId&&title&&category&&subcategory&&tags)){
      return res.status(400).send({status:false,msg: "this data is required"})}
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "invalid request put valid data in body" });}

    if (!mongoose.isValidObjectId(authorId)) {
      res.status(400).send({status: false, msg: "invalid author id"})}

    if(!typeof(title) == String && title.trim().length==0){res.status(400).send({status: false, msg: "title name is invalid"})}
    if(!typeof(body) == String && body.trim().length==0){res.status(400).send({status: false, msg: "body format is invalid"})}
    if(!typeof(category) == String && category.trim().length==0){res.status(400).send({status: false, msg: "category is invalid"})}
    if(!typeof(subcategory) == Array && subcategory.length==0 ){res.status(400).send({status: false, msg: "subcategory is invalid"})}
    if(!typeof(tags) == Array && tags.length==0){res.status(400).send({status: false, msg: "tag is invalid"})}
    if(!typeof(isPublished) == Boolean){res.status(400).send({status: false, msg: "isPublished should be true or false"})}

     for(let i=0; i<subcategory.length; i++){
        if(subcategory[i]!==typeof("string"|| subcategory[i].trim().length==0)){
          res.status(400).send({status: false, msg: "element of subcategory is invalid"})}}

    for(let i=0; i<tags.length; i++){
      if(tags[i]!==typeof("string")|| tags[i].trim().length==0){
  res.status(400).send({status: false, msg: "element of tags is invalid"})}}

    //validation end

    data = await blogModel.create(data);
    return res.status(201).send({ status: true, data: {
      title:title,
      body:body,
      authorId:authorId,
      category:category,
      tags:tags,
      subcategory:subcategory,
      isPublished:isPublished} });}
      
      catch (error) {
    return res.status(500).send({ status: false, msg: error.message }) }};


//............................................................... GET API's ..............................................................................


exports.getBlog = async (req, res) => {
  try {
    let queryparam = req.query;
    let{authorId}= queryparam
    
    if(!mongoose.isValidObjectId(authorId)){
      res.status(400).send({status:false, msg:"please provide valid authorId"})}


    if (Object.keys(queryparam).length == 0) {
      let blog = await blogModel
        .find({ isDeleted: false, isPublished: true })
        .populate("authorId");
      res.status(200).send({status:true, msg: blog });
      if (blog.length == 0) {
        res.status(404).send({status:false, msg:"No blogs found"});}}

    if (Object.keys(queryparam).length > 0) {
      let filteredBlogs = await blogModel.find(queryparam).populate("authorId");
      if(filteredBlogs.length==0){
        res.status(404).send({status:false, msg:"No blogs found with these filter"})}

      res.status(200).send({status:true, data: filteredBlogs });}}

     catch (error) {
    res.status(500).send({status:false, Error: error.message });}};


//.............................................................................. Update API's .............................................................
//............................................................. Update By Path Param ..............................................................................


const updateDetails = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    
    const {
      title,
      body,
      tags,
      subcategory,
      category
    } = req.body;
    console.log(req.body);

     if(title){
    if(title.trim().length==0 || title==undefined || typeof title!== String){
    res.status(400).send({status:false, msg: "can not update blog with invalid title."})}

    if(body){
    if(body.trim().length==0 || body==undefined || typeof body!== String){
      res.status(400).send({status:false, msg: "can not update blog with invalid body."})}}

      if(category){
        if(category.trim().length==0 || category==undefined || typeof category!== String){
          res.status(400).send({status:false, msg: "can not update blog with invalid category."})}}  

      if(tags){
        if(tags.length==0|| tags==undefined || typeof tags!== Array){
        res.status(400).send({status:false, msg: "can not update blog with invalid body."})}}

      if(tags){
        for(let i=0; i<tags.length; i++){
          if(tags[i]!==typeof("string")|| tags[i].trim().length==0){
      res.status(400).send({status: false, msg: "element of tags is invalid"})}}}

      if(subcategory){
        if(subcategory.length==0|| subcategory==undefined || typeof subcategory!== Array){
        res.status(400).send({status:false, msg: "can not update blog with invalid subcategory."})}}

        if(subcategory){
          for(let i=0; i<subcategory.length; i++){
            if(subcategory[i]!==typeof("string")|| subcategory[i].trim().length==0){
        res.status(400).send({status: false, msg: "element of subcategory is invalid"})}}}


    }
    let today = moment().format("YYYY-DD-MM,h:mm:ss a");
    
    let identity= req.identity

    const updateFileds = await blogModel.findOneAndUpdate(
      { _id: blogId, authorId : identity, isDeleted: false }, //Filter condition
      {
        title: title,
        body: body,   
        $push: { tags: tags, subcategory: subcategory }, // Updation Field
        isPublished: true,
        publishedAt: today,
        category:category
      },
      { new: true }  ); // Returns updated result

    if(!updateFields){
      res.status(400).send({status: false, msg: "can not update this blog"})}

    return res.status(200).send({status:true, data: updateFileds });}
    
    catch (err) {
    res.status(500).send({status:false, error: err.message })}};


//............................................................. DELETE API's ..............................................................................
//............................................................. Delete By Path Param ..............................................................................


const deleteData = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    
    
    let identity= req.identity

    let detail = await blogModel.findOneAndUpdate(
      { _id: blogId, authorId: identity, isDeleted:false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true });
      

    if(!detail){
      res.status(404).send({status:false, msg:"can not delete the blog."})}

    return res.status(200).send();} 
    
    catch (err) {
    res.status(500).send({status:false, Error:err.message});}};

//----------------------------------------------- Delete by Query Param ------------------------------------------

exports.deleteByQuery = async function (req, res) {
  try {
    const{title, body, category, subcategory, tags, authorId,  isPublished}=req.query
    const filter = {isDeleted: false}
      if(!Object.keys(req.query).length==0){
        if(authorId || authorId==""){
          if(!mongoose.isValidObjectId(authorId)){
            return res.status(400).send({status:false, msg:"invalid authorId"})
          }
        }
      }
      filter.authorId=authorId
      if(isPublished){
        filter.isPublished= isPublished
      }
      if(category){
        filter.category= category
      }
      if(title){
        filter.title=title
      }
      if(body){
        filter.body=body
      }
      if(tags){
        let arr= tags.trim().split(',').map((ele)=> ele.trim())
        filter.tags={$all: arr}
      }
      if(subcategory){
        let arr= subcategory.trim().split(',').map((ele)=> ele.trim())
        subcategory.tags={$all: arr}
      }
      let findDocs= await blogModel.find(filter)
      if(findDocs.length==0){
        res.status(404).send({status:false, msg: "this blog data is not available"})
      }

      let identity= req.identity
             
    let detail = await blogModel.updateMany({
      authorId: identity},
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (detail["modifiedCount"] == 0) {
      res.status(404).send({status:false, msg:"No blogs found"});}

    if(!detail){
      res.status(400).send({status:false, msg:"can not delete these blogs. May be they don't exist at your end!!"})}

    res.status(200).send();
    console.log(detail);}
    
    catch (err) {
    res.status(500).send({status:false, Error: err.message })}};

module.exports.createBlogs = createBlogs;
module.exports.updateDetails = updateDetails;
module.exports.deleteData = deleteData;

