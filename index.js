const express = require("express");
const speakeasy = require('speakeasy');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
const mongoDB=require("./db");
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.header(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-with, Content-Type ,Accept"
  );
  next();
})

mongoDB();

// app.get("/",(req,res)=>{
//     res.send("hello world")
// })

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// //Route implementation using middleware differnt request comes here it will give response//
app.use(express.json());
app.use("/api",require("./Routes/CreateUser"))
app.use("/api",require("./Routes/DisplayData"))
app.use("/api",require("./Routes/OrderData"))

app.use('/api', require("./Routes/CreateTotp"))
app.use('/api', require("./Routes/Checktotp"))
app.use('/api', require("./Routes/Verifyotp"))
app.listen(port,()=>{
    console.log(`Example app listen on port ${port}`);
})