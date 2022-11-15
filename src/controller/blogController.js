const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose')
const validation = require('../validate/validation')
const { populate } = require("../models/blogModel")


const createBlogs = async function (req, res) {
    try {
        const id = req.body.authorId
        let data = { title, body, authorId, category, tags, subcategory, isPublished } = req.body
        // validation start
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "invalid request put valid data in body" })
        }
        //validation end
        const saveData = await blogModel.create(data)
        return res.status(201).send({ status: true, data: saveData })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


exports.getBlog = async (req, res) => {
    try {
        let queryparam = req.query;
        
        if (Object.keys(queryparam).length == 0) {
      let blog = await blogModel.find({ isDeleted: false, isPublished: true }).populate("authorId");
      res.status(200).send({ msg: blog });
      if (blog.length == 0) {
        res.status(404).send("No blogs found");
      }
    }
    
    if (Object.keys(queryparam).length > 0) {      
        let { category, subcategory, tags, authorId,title } = queryparam;

        
        let filteredBlogs = await blogModel.find(queryparam).populate("authorId");
        res.status(200).send({ msg: filteredBlogs });
    }
} catch (error) {
    res.status(404).send({ message: error });
}
};

module.exports.createBlogs= createBlogs