import * as express from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import validateSignUp from '../validation/signup'
import validateSignIn from '../validation/signin'
import User from '../models/user.model'

const SECRET = process.env.SECRET
const userRouter = express.Router()

userRouter.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignUp(req.body)
  const { username, email, password } = req.body
  if (!isValid) {
    return res.status(400).json(errors)
  }
  User.findOne({ $or: [{ email }, { username }] }).then((user: any) => {
    if (user) {
      if (user.email === email)
        return res.status(400).json({ email: 'Email already exists' })
      else return res.status(400).json({ username: 'Username already exists' })
    } else {
      const newUser: any = new User({ username, email, password })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log({ error: 'Error creating a new user' }))
        })
      })
    }
  })
})

userRouter.post('/signin', (req, res) => {
  const { errors, isValid } = validateSignIn(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const { email, password } = req.body
  User.findOne({ email }).then((user: any) => {
    if (!user) {
      return res.status(404).json({ email: 'Email not found' })
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username,
        }
        jwt.sign(payload, SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) {
            console.log(err)
          }
          return res.json({
            success: true,
            token: 'Bearer ' + token,
          })
        })
      } else {
        return res.status(400).json({ password: 'Password Incorrect' })
      }
    })
  })
})

export default userRouter
