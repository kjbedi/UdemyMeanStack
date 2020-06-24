const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: {type: String, require: true},
  content: {type: String, require: true}
});

module.exports = mongoose.model('Post', postSchema); // collection name would be lower case plular of model name for eg. here it would be posts
