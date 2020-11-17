const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, },
  blogContent: { type: String, required: true, },
  tags: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
},
{timestamps: true})

module.exports = mongoose.model('Post', PostSchema);