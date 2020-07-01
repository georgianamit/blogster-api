import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.model'
import * as dotenv from 'dotenv'
dotenv.config()
const SECRET = process.env.SECRET

const _passport = (passport) => {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET,
      },
      (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload.id })
          .then((user) => {
            if (user) {
              return done(null, user)
            } else {
              return done(null, false)
            }
          })
          .catch((err) =>
            console.log({ error: 'Error authenticating the user' })
          )
      }
    )
  )
}
export default _passport
