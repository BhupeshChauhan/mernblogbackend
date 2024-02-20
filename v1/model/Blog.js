const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = mongoose.Schema({

    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        // required: true,
    },
    des: {
        type: String,
        // required: true
    },
    content: {
        type: [],
        // required: true
    },
    tags: {
        type: [String],
        // required: true
    },
    categories: {
        type: [String],
    },
    feature: {
        type: [String],
    },
    visible: {
        type: [String],
    },
    slug: {
        type: String,
        // required: true,
    },
    excerpt: {
        type: String,
        // required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    draft: {
        type: Boolean,
        default: false
    },
    inActive: Boolean
}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 

})

const Blog =  mongoose.model("blogs", blogSchema);
module.exports = Blog;