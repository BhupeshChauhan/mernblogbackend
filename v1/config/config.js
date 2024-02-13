//import dotenv
require('dotenv').config();

//add app config data
module.exports = {
  MONGODB_URL: process.env.DB_LOCATION,
  PORT: process.env.PORT
}