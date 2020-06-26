import * as mongoose from 'mongoose'
import { Schema, model } from 'mongoose'

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const Post = mongoose.model('posts', PostSchema)
export default Post
