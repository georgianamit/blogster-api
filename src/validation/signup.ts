import * as Validator from 'validator'
import * as isEmpty from 'is-empty'

interface IErrors {
  username: string
  email: string
  password: string
}

const validateSignUp = (
  data
): { errors: IErrors; isValid: (IErrors) => boolean } => {
  let errors: IErrors
  let { username, email, password } = data
  username = !isEmpty(username) ? username : ''
  email = !isEmpty(email) ? email : ''
  password = !isEmpty(password) ? password : ''

  if (Validator.isEmpty(username)) {
    errors.username = 'Username is required'
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email is required'
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Enter a valid email id'
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password is required'
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
export default validateSignUp
