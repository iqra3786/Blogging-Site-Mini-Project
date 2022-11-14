const { default: mongoose } = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://group22:1234@group22databse.uvtoalh.mongodb.net/group22Database",{
    useNewUrlParser: true
})

.then(()=> console.log("MongoDB is connected, Good:uck for the project!!!"))
.catch(err => console.log(err))


app.use("/",route)

app.listen(process.env.PORT || 2200, function () {
    console.log('Express app running on port ' + (process.env.PORT || 2200))
});


