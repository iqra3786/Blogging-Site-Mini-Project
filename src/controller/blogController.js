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
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "invalid request put valid data in body" });
    }
    //validation end
    const saveData = await blogModel.create(data);
    return res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};


//...............................................................GET API's..............................................................................


exports.getBlog = async (req, res) => {
  try {
    let queryparam = req.query;

    if (Object.keys(queryparam).length == 0) {
      let blog = await blogModel
        .find({ isDeleted: false, isPublished: true })
        .populate("authorId");
        console.log(blog)
      res.status(200).send({ msg: blog });
      if (blog.length == 0) {
        res.status(404).send("No blogs found");
      }
    }

    if (Object.keys(queryparam).length > 0) {
      let { category, subcategory, tags, authorId, title } = queryparam;

      let filteredBlogs = await blogModel.find(queryparam).populate("authorId");
      res.status(200).send({ msg: filteredBlogs });
    }
  } catch (error) {
    res.status(404).send({ message: error });
  }
};


//..............................................................................Update API's.............................................................


const updateDetails = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const {
      title,
      body,
      tags,
      subcategory,
      publishedAt,
      isPublished,
      isDeleted,
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
      { new: true }  // Returns updated result
    );
    console.log(updateFileds);

    return res.status(200).send({ msg: updateFileds });
  } catch (err) {
    console.log("This is the error: ", err.message);
    res.status(500).send({ error: err.message });
  }
};


//.............................................................DELETE API's..............................................................................


const DeleteData = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let detail = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    return res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};



exports.queryApi = async function (req, res) {
  try {
    let { category, authorid, tags, subcategory, unpublished } = req.query;

    let detail = await blogModel.updateMany(
      req.query,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    console.log(Object.keys(detail));
    if (detail["modifiedCount"] == 0) {
      res.status(404).send("No blogs found");
    }
    res.status(200).send();
    console.log(detail);
  } catch (err) {
    res.status(500).send({ err });
  }
};

module.exports.createBlogs = createBlogs;
module.exports.updateDetails = updateDetails;
module.exports.DeleteData = DeleteData;
