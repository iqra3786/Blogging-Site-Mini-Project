const express= require('express')
const router= express.Router()
const authorController= require("../controller/authorController.js")
const blogController= require("../controller/blogController.js")
const middleware = require("../middleware/auth")

router.post('/authors', authorController.createAuthors)
router.post('/blogs',blogController.createBlogs)

router.get('/blogs',middleware.authenticate, blogController.getBlog)

router.put('/blogs/:blogId', middleware.authenticate,middleware.authorisation,blogController.updateDetails)
router.delete('/blogs/:blogId',middleware.authenticate,middleware.authorisation,blogController.DeleteData)
router.delete('/blogs',middleware.authenticate,middleware.authorisation,blogController.queryApi)

router.post('/login',authorController.authorLogin)


module.exports = router