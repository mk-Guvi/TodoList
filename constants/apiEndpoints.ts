const signUpUrl = (host: string) => {
  return `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${host}/api/auth/signup`;
};
export const ApiEndpoints = {
  GET_USERS: 'https://fakerapi.it/api/v1/users?_quantity=1000&_gender=male',
  SIGNUP: signUpUrl,
};
