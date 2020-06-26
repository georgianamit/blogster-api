import * as Validator from 'validator'
import * as isEmpty from 'is-empty'

const validatePostInput = (data) => {
  let errors: { title: string; body: string }

  let { title, body } = data
  title = !isEmpty(title) ? title : ''
  body = !isEmpty(body) ? body : ''

  if (Validator.isEmpty(title)) {
    errors.title = 'Title is required'
  }
  if (Validator.isEmpty(body)) {
    errors.body = 'Description is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
export default validatePostInput
