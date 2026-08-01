import * as Form from '@rinn7e/tea-cup-form'
import * as E from 'fp-ts/lib/Either'

export const minLengthIfExistValidator =
  (label: string, minLength: number) =>
  (input: string): E.Either<string, string> => {
    if (input.length === 0) {
      return E.right(input)
    }
    return Form.minLengthValidator(label, minLength)(input)
  }

export const isEmailField = (str: string): boolean => {
  return str.toLowerCase().includes('email')
}
