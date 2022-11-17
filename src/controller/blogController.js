const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");
const validation = require("../validate/validation");
const { populate } = require("../models/blogModel");
const moment = require("moment");

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


//...............................................................GET API's..............................................................................


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


//..............................................................................Update API's.............................................................


const updateDetails = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    
    const {
      title,
      body,
      tags,
      subcategory
    } = req.body;
    console.log(req.body);
    let today = moment().format("YYYY-DD-MM,h:mm:ss a");

    const updateFileds = await blogModel.findOneAndUpdate(
      { _id: blogId }, //Filter condition
      {
        title: title,
        body: body,   
        $push: { tags: tags, subcategory: subcategory }, // Updation Field
        isPublished: true,
        publishedAt: today,
      },
      { new: true }  ); // Returns updated result

    if(!updateFields){
      res.status(400).send({msg: "can not update this blog"})}

    return res.status(200).send({status:true, data: updateFileds });}
    
    catch (err) {
    res.status(500).send({status:false, error: err.message })}};


//.............................................................DELETE API's..............................................................................


const DeleteData = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    let detail = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true });

    if(!detail){
      res.status(404).send({status:false, msg:"can not delete the blog because it is not available"})}

    return res.status(200).send();} 
    
    catch (err) {
    res.status(500).send({status:false, Error:err.message});}};



exports.queryApi = async function (req, res) {
  try {
    let detail = await blogModel.updateMany(
      req.query,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    console.log(Object.keys(detail));
    if (detail["modifiedCount"] == 0) {
      res.status(404).send({status:false, msg:"No blogs found"});}

    if(!detail){
      res.status(400).send({status:false, msg:"can not delete these blogs. May be they don't exist!!"})}

    res.status(200).send();
    console.log(detail);}
    
    catch (err) {
    res.status(500).send({status:false, Error: err.message })}};

module.exports.createBlogs = createBlogs;
module.exports.updateDetails = updateDetails;
module.exports.DeleteData = DeleteData;
