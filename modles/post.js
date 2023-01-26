const mongoose = require("mongoose");

// Создаем схему
const postSchema = new mongoose.Schema({
   titletextindex: {
    type: String,
    trim: true
  },
  titleimgindex: {
    type: String,
    trim: true
  },
  imgindexalt: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  pageimg: {
    type: [String]    
    },
    content: {
        type: String,
        trim: true
    },
    views: {
        type: String,
        trim: true
    },
    date: {
        type: String,        
    },
    linkas: {
        type: String,
        trim: true
      }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;