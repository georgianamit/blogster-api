import * as express from 'express'
import { Request, Response } from 'express'
import Post from '../models/post.model'
import validatePost from '../validation/post'
import * as passport from 'passport'

const postRouter = express.Router()
interface IRequest extends Request {
  user: any
}
postRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: IRequest, res: Response) => {
    Post.find({ author: req.user.username })
      .then((posts) => res.status(200).json(posts))
      .catch((err) =>
        res.status(400).json({ user: 'Error fetching posts of logged in user' })
      )
  }
)
postRouter.get('/:id', (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((err) => res.status(400).json({ id: 'Error fetching post by id' }))
})

postRouter.get('/author/:author', (req, res) => {
  Post.find({ author: req.params.author })
    .then((posts) => res.status(200).json(posts))
    .catch((err) =>
      res
        .status(400)
        .json({ author: 'Error fetching posts of specific author' })
    )
})
postRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  (req: IRequest, res: Response) => {
    const author = req.user.username
    const post = req.body
    const { errors, isValid } = validatePost(post)
    if (!isValid) {
      return res.status(400).json(errors)
    }
    post.author = author
    const newPost = new Post(post)
    newPost
      .save()
      .then((doc) => res.json(doc))
      .catch((err) => console.log({ create: 'Error creating new post' }))
  }
)

postRouter.patch(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  (req: IRequest, res: Response) => {
    const author = req.user.username
    const { errors, isValid } = validatePost(req.body)
    if (!isValid) {
      return res.status(400).json(errors)
    }
    const { title, body } = req.body
    Post.findOneAndUpdate(
      { author, _id: req.params.id },
      { $set: { title, body } },
      { new: true }
    )
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ update: 'Error updating existing post' })
      )
  }
)

postRouter.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  (req: IRequest, res: Response) => {
    const author = req.user.username
    Post.findOneAndDelete({ author, _id: req.params.id })
      .then((doc) => res.status(200).json(doc))
      .catch((err) => res.status(400).json({ delete: 'Error deleting a post' }))
  }
)

export default postRouter
