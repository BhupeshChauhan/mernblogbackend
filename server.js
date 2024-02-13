const app = require('./app.js');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const CONFIG = require('./v1/config/config.js');
const connectToDB = require('./v1/db/db.js');

//constants
const environment = process.env.NODE_ENV

//config

//Middleware
if(environment === 'development'){
    app.use(morgan('dev'))
}
app.use(cors());

//DB
connectToDB();

app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`)
}) 