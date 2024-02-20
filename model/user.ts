import mongoose, {Schema} from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const UserSchema = new Schema(
  {
    id: String,
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
      },
      inActive: {
        type: Boolean,
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
    client: {
      type: Boolean,
      required: true,
    },
    roleId: {
      type: Number,
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
  // @ts-ignore
  this.personal_info.password = await bcrypt.hash(this.personal_info.password, 12);
  next();
});
//This method will chain a function that compares and validates the password.
UserSchema.methods.isValidPassword = async function (
  currentPassword: any,
  storedUserPassword: any
) {
  return await bcrypt.compare(currentPassword, storedUserPassword);
};

const User = mongoose.model("User", UserSchema);
export default User;
