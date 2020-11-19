import { ValidationError } from 'yup';

interface Errors {
  [field: string]: string;
}

export default function getValidateErrros(err: ValidationError): Errors {
  const validationError: Errors = {};

  err.inner.forEach(error => {
    validationError[error.path] = error.message;
  })

  return validationError;
}