const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const UserSchema = mongoose.Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: [true, "A user must have a full name"],
        minlength: [3, "fullname must be 3 letters long"],
      },
      email: {
        type: String,
        required: [true, "A user must have an email"],
        unique: [true, "A user email must be unique"],
        lowercase: true,
        validate: [validator.isEmail, "Please, enter a valid email"],
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        minlength: [3, "Username must be 3 letters long"],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`;
        },
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

//add a pre-hook function to the UserSchema. This function gets called before the user info is stored in the database
UserSchema.pre("save", async function (next) {
  //hash incoming password before saving to db
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
//This method will chain a function that compares and validates the password.
UserSchema.methods.isValidPassword = async function (
  currentPassword,
  storedUserPassword
) {
  return await bcrypt.compare(currentPassword, storedUserPassword);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
