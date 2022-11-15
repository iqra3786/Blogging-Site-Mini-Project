const express= require('express')
const router= express.Router()
const authorController= require("../controller/authorController.js")
const blogController= require("../controller/blogController.js")


router.post('/authors', authorController.createAuthors)
router.post('/blogs',blogController.createBlogs)

router.get('/blogs', blogController.getBlog)

router.put('/blogs/:blogId', blogController.updateDetails)
router.delete('/blogs/:blogId',blogController.DeleteData)
router.delete('/blogs',blogController.queryApi)


module.exports = router