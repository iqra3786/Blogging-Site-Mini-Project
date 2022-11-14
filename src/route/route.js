const express= require('express')
const router= express.Router()
const authorController= require("../controller/authorController,js")
const blogController= require("../controller/blogController.js")


roter.post('/authors', authorController.createAuthor)