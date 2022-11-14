const express= require('express')
const router= express.Router()
const authorController= require("../controller/authorController.js")
const blogController= require("../controller/blogController.js")


router.post('/authors', authorController.createAuthors)
router.post('/blogs',blogController.createBlogs)

module.exports=router