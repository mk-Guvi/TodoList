import { isEmailValid, isValueEmpty } from '../../utils';

interface LoginFormValues {
  email: string;
  password: string;
}
export const validateLoginInputs = (values: LoginFormValues) => {
  let errors: Record<string, string> = {};
  if (isValueEmpty(values?.email)) {
    errors['email'] = 'Required.';
  } else if (!isEmailValid(values?.email)) {
    errors['email'] = 'Invalid Email Address.';
  }

  if (isValueEmpty(values?.password)) {
    errors['password'] = 'Required.';
  } else if (values?.password?.length < 8 || values?.password?.length > 20) {
    errors['password'] = `Password must be ${values?.password?.length < 8 ? 'atleast 8 characters' : 'lesser than 20 characters'}.`;
  }

  return errors;
};

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export const validateSignupInputs = (values: SignupFormValues) => {
  let errors: Record<string, string> = {};
  if (isValueEmpty(values?.username)) {
    errors['username'] = 'Required.';
  } else if (values?.username?.includes(' ')) {
    errors['username'] = 'Invalid Username.';
  }

  if (isValueEmpty(values?.email)) {
    errors['email'] = 'Required.';
  } else if (!isEmailValid(values?.email)) {
    errors['email'] = 'Invalid Email Address.';
  }

  if (isValueEmpty(values?.password)) {
    errors['password'] = 'Required.';
  } else if (values?.password?.length < 8 || values?.password?.length > 20) {
    errors['password'] = `Password must be ${values?.password?.length < 8 ? 'atleast 8 characters' : 'lesser than 20 characters'}.`;
  }

  if (isValueEmpty(values?.confirmPassword)) {
    errors['confirmPassword'] = 'Required.';
  } else if (values?.password?.length < 8 || values?.password?.length > 20) {
    errors['confirmPassword'] = `Password must be ${values?.password?.length < 8 ? 'atleast 8 characters' : 'lesser than 20 characters'}.`;
  } else if (values?.confirmPassword !== values?.password) {
    errors['confirmPassword'] = "Password doesn't match";
  }

  return errors;
};
