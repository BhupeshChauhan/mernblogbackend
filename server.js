const express = require("express");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const CONFIG = require('./v1/config/config.js');
const connectToDB = require('./v1/db/db.js');
const morgan = require("morgan");

const postRoutes = require("./v1/routes/post.routes");
const userRoutes = require("./v1/routes/user.routes");
const uploadImgRoutes = require("./v1/routes/upload.img.routes");
const categoriesRoutes = require("./v1/routes/categories.routes.js");
const tagsRoutes = require("./v1/routes/tags.routes.js");
const rolesRoutes = require("./v1/routes/roles.routes.js");

//crete express app
const app = express();

//add middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/", uploadImgRoutes);
app.use("/api/v1/tags", tagsRoutes);
app.use("/api/v1/roles", rolesRoutes);


//DB
connectToDB();

app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`)
}) 