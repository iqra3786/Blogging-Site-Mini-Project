const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose')
const validation = require('../validate/validation')


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

module.exports.createBlogs= createBlogs