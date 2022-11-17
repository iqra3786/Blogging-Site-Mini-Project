const express= require('express')
const router= express.Router()
const authorController= require("../controller/authorController.js")
const blogController= require("../controller/blogController.js")
const middleware = require("../middleware/auth")

//............................................... Post Api .....................................................................

router.post('/authors', authorController.createAuthors)
router.post('/blogs',blogController.createBlogs)

//............................................... Get Api .....................................................................

router.get('/blogs',middleware.authenticate, blogController.getBlog)

//............................................... Put Api .....................................................................

router.put('/blogs/:blogId', middleware.authenticate,middleware.authorisation,blogController.updateDetails)

//............................................... Delete Api .....................................................................

router.delete('/blogs/:blogId',middleware.authenticate,middleware.authorisation,blogController.deleteData)
router.delete('/blogs',middleware.authenticate,middleware.authorisation,blogController.deleteByQuery)

//............................................... Post Api for Log In .....................................................................

router.post('/login',authorController.authorLogin)


module.exports = router