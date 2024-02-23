//import mongoose 
import mongoose from 'mongoose'

//database connection function
function connectToDB(){
    //@ts-ignore
    mongoose.connect(`${process.env.DB_LOCATION}` || 'mongodb://127.0.0.1:9000');

    //Add event listener to test connection
    mongoose.connection.on('connected', () => {
        console.log('connection to DB successful')
    })
    //catch error
    mongoose.connection.on("error", (err) => {
        console.log('Connection to DB failed')
        console.log(err.message)
    })
}
//export database connection function
export default connectToDB;