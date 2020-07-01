import * as express from 'express'
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import _passport from './middleware/passport'
import posts from './routes/posts'
import users from './routes/users'

const app = express()
dotenv.config()

const MONGO_URI = process.env.MONGO_URI

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to database...'))
  .catch((err) => console.log(err))
mongoose.set('useFindAndModify', false)

app.use(passport.initialize())
_passport(passport)

app.use('/api/user', users)
app.use('/api/post', posts)
app.get('/', (req: Request, res: Response) => {
  res.send(req.body)
})

export default app
