const express = require('express');
const postRoutes = require("./v1/routes/post.routes");
const userRoutes = require("./v1/routes/user.routes");

//crete express app
const app = express();

//add middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/posts", postRoutes);

// let prefixRoute = '/api/v1/'
// let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
// let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


// const generateUserName = async(email) => {
//     let userName = email.split("@")[0];
//     let isUserNameNotUnique = await User.exists({"personal_info.username": userName}).then(result => result)
//     if(isUserNameNotUnique) {
//         userName = userName += nanoid(3)
//     }
//     return userName;
// }

// app.post('/signup', (req, res) => {
//     let { fullname, email, password } = req.body

//     if (!fullname?.length || fullname?.length < 3) {
//         return res.status(403).json({ "error": "Fullname must be atleast 3 letters"})
//     }

//     if (!email?.length || !emailRegex.test(email)) {
//         return res.status(403).json({ "error": "Please enter a valid email"})
//     }

//     if (!password?.length || !passwordRegex.test(password)) {
//         return res.status(403).json({ "error": "Please enter a password between 6 to 20 characters with a numerics, 1 lowercase and 1 uppercase letter"})
//     }


    
//     bcrypt.hash(password, 10, async(err, hashed_password) => {
//         let username = await generateUserName(email)
//         let newUser = new User({
//             personal_info: { fullname, email, password: hashed_password, username }
//         })
//         newUser.save().then((result) => {
//             return res.status(200).json({ "user": result})
//         }).catch((error) => {
//             if(error.status === 11000) {
//                 return res.status(404).json({ "error": "Email already exists"})
//             }
//             return res.status(500).json({ "error": error.message})
//         });
//     })
// })

// app.post('/signin', (req, res) => {
//     let { fullname, email, password } = req.body

//     if (!email?.length || !emailRegex.test(email)) {
//         return res.status(403).json({ "error": "Please enter a valid email"})
//     }

//     if (!password?.length || !passwordRegex.test(password)) {
//         return res.status(403).json({ "error": "Please enter a password between 6 to 20 characters with a numerics, 1 lowercase and 1 uppercase letter"})
//     }

//     User.findOne({"personal_info.email": email}).then((result) => {
//         if(!result) {
//             return res.status(404).json({ "error": "Email does not exist"})
//         }
//         bcrypt.compare(password, result.personal_info.password, (err, password) => {
//             if(err) {
//                 return res.status(403).json({ "error": "An error occurred while login please try again"});
//             }
//             if(!password){ 
//                 return res.status(403).json({ "error": "Invalid password"})
//             } else {
//                 return res.status(200).json({ "success":result})
//             }
//         })
//     }).catch((error) => {
//         if(error.status === 11000) {
//             return res.status(404).json({ "error": "Email already exists"})
//         }
//         return res.status(500).json({ "error": error.message})
//     });
// })

module.exports = app