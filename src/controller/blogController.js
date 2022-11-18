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
      isDeleted,
      deletedAt,
      publishedAt,
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

    if(typeof(title) !== String && title.trim().length==0){res.status(400).send({status: false, msg: "title name is invalid"})}
    if(typeof(body) !== String && body.trim().length==0){res.status(400).send({status: false, msg: "body format is invalid"})}
    if(typeof(category) !== String && category.trim().length==0){res.status(400).send({status: false, msg: "category is invalid"})}
    if(typeof(subcategory) !== Array && subcategory.length==0 ){res.status(400).send({status: false, msg: "subcategory is invalid"})}
    if(typeof(tags) !== Array && tags.length==0){res.status(400).send({status: false, msg: "tag is invalid"})}
    if(typeof(isPublished) !== Boolean && isPublished == true){res.status(400).send({status: false, msg: "isPublished should be false at the time of creation."})}
    if(isPublished == false){publishedAt = null}
    if(typeof(isDeleted) !== Boolean && isDeleted == true){res.status(400).send({status: false, msg: "isDeleted should be false at the time of creation."})}
    if(isDeleted == false){deletedAt = null}


    let arr = []

     for(let i=0; i<subcategory.length; i++){
      subcategory[i] = subcategory[i].toString()
      arr.push(subcategory[i])
    }
      //   if(subcategory[i]!==typeof("string")|| (subcategory[i].trim().length==0)){
      //     res.status(400).send({status: false, msg: "element of subcategory is invalid"})}}
      let newArr = []

      for(let i=0; i<tags.length; i++){
       tags[i] = tags[i].toString()
       newArr.push(tags[i])
     }

  //   for(let i=0; i<tags.length; i++){
  //     if(tags[i]!==typeof("string")|| tags[i].trim().length==0){
  // res.status(400).send({status: false, msg: "element of tags is invalid"})}}

    //validation end

    data = await blogModel.create(   
   {   title: title,
      body: body,
      authorId: authorId,
      category: category,
      tags: newArr,
      subcategory:arr,
      isPublished:isPublished,
      isDeleted:isDeleted,
      deletedAt:deletedAt,
      publishedAt:publishedAt,
    }
);
    return res.status(201).send({ status: true, data:data});}
      
      catch (error) {
    return res.status(500).send({ status: false, msg: error.message }) }};


//............................................................... GET API's ..............................................................................


exports.getBlog = async (req, res) => {
  try {
    let queryparam = req.query;
    let{authorId,title,body, category, subcategory, tags}= queryparam
    
    // if(!mongoose.isValidObjectId(authorId)){
    //   res.status(400).send({status:false, msg:"please provide valid authorId"})}


    if (Object.keys(queryparam).length == 0) {
      let blog = await blogModel
        .find({ isDeleted: false, isPublished: true })
        .populate("authorId");
      res.status(200).send({status:true, msg: blog });
      if (blog.length == 0) {
        res.status(404).send({status:false, msg:"No blogs found"});}}

    if (Object.keys(queryparam).length > 0) {
      let filteredBlogs = await blogModel.find({
        authorId:authorId,
        title: title,
        body:body, 
        category: category,
         subcategory:subcategory, 
         tags:tags,
         isDeleted: false, 
         isPublished: true
        }).populate("authorId");
      if(filteredBlogs.length==0){
        res.status(404).send({status:false, msg:"No blogs found with these filter"})}

      res.status(200).send({status:true, data: filteredBlogs });}}

     catch (error) {
    res.status(500).send({status:false, Error: error.message });}};


//.............................................................................. Update API's .............................................................
//............................................................. Update By Path Param ..............................................................................


const updateDetails = async function (req, res) {
  try {
   
    let data = req.body
    let id = req.params.blogId
    let authorloged = req.identity //identity is present in request that we have set in authorization middleware it contains loggedIn AuthorId
    if (Object.keys(data).length == 0) {  //validation to check if body empty
        return res.status(400).send("Please Enter data for updation");
    }
    const checkBlogId = await blogModel.findById(id)  //finding data using blogId
    if (!checkBlogId) return res.status(404).send({ msg: "No blog found with this blogId" });
    if (checkBlogId.isDeleted === true) return res.status(400).send({ msg: "Blog is deleted" });

    if (checkBlogId.authorId != authorloged) { //In this block verifying BlogId belongs to same author or not
            return res.status(403).send({ status: false, data: "Not authorized" })
     }

    //here storing data comming from body inside previous document
    if (data.title) checkBlogId.title = data.title;
    if (data.category) checkBlogId.category = data.category;
    if (data.body) checkBlogId.body = data.body;

    //------for tags that is array-----------
    if (data.tags) {
        if (typeof data.tags === "object") {
            checkBlogId.tags.push(...data.tags)
        }
        else if (typeof data.tags === "string") {
            checkBlogId.tags.push(data.tags)
        }
        else {
            return res.status(400).send({ status: false, msg: "Please send tags in array" })
        }
    }
    //-----------for subcategory that is arry------------
    if (data.subcategory) {
        if (typeof data.subcategory === 'object') {
            checkBlogId.subcategory.push(...data.subcategory)
        } else if (typeof data.subcategory === "string") {
            checkBlogId.subcategory.push(data.subcategory)
        }
        else {
            return res.status(400).send({ status: false, msg: "Please send subcategory in array" })
        }
    }
    if (typeof data.isPublished === 'boolean') {
        if (data.isPublished == true) {
            checkBlogId.publishedAt = new Date();  //timestamp will add incase published is set to true
            checkBlogId.isPublished = true
        } if (data.isPublished == false) {
            checkBlogId.publishedAt = ""
            checkBlogId.isPublished = false
        }
    }
    checkBlogId.save()
    res.status(200).send({ status: true, msg: "blog updated", data: checkBlogId })
    
  }
    
    catch (err) {
    res.status(500).send({status:false, error: err.message })}};


//............................................................. DELETE API's ..............................................................................
//............................................................. Delete By Path Param ..............................................................................


const deleteData = async function (req, res) {
  try {
    let data = req.params
    let id = data.blogId
    let authorloged = req.identity //identity is present in request that we have set in authorization middleware it contains loggedIn AuthorId
    if (id) {
        let findblog = await blogModel.findById(id)
        if (!findblog) return res.status(404).send({ status: false, msg: `no blog found by this BlogID:${id}` });

        if (findblog.authorId != authorloged) {
            return res.status(403).send({ status: false, data: "Not authorized" })
        }
        //Validation to check blog is already deleted or not
        if (findblog.isDeleted !== false) { return res.status(404).send({ status: false, msg: "Blog is already deleted" }) };
        await blogModel.findOneAndUpdate(
            { _id: id },
            {
                $set: { isDeleted: true, deletedAt: new Date()}
            })
        res.status(200).send({ status: true, msg: "Succesfull" });
    }
    
  } 
    
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
    console.log(detail);
    
  }
    
    catch (err) {
    res.status(500).send({status:false, Error: err.message })}};

module.exports.createBlogs = createBlogs;
module.exports.updateDetails = updateDetails;
module.exports.deleteData = deleteData;

