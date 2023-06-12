import { AiFillEye } from '@react-icons/all-files/ai/AiFillEye';
import { AiFillEyeInvisible } from '@react-icons/all-files/ai/AiFillEyeInvisible';
import { HiAtSymbol } from '@react-icons/all-files/hi/HiAtSymbol';
import { HiOutlineUser } from '@react-icons/all-files/hi/HiOutlineUser';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container } from '../../components';
import { LoaderSvg } from '../../components/loaders/CircularLoader';

import { ApiEndpoints } from '../../constants';
import { BackendPost } from '../../integrations';
import styles from '../../styles/Form.module.css';
import { AuthLayout } from './AuthLayout';
import { validateSignupInputs } from './helper';

type ShowPasswordStateT = {
  newPassword: boolean;
  confirmPassword: boolean;
};
export const Signup = () => {
  const [showPassword, setShowPassword] = useState<ShowPasswordStateT>({
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateSignupInputs,
    onSubmit,
  });

  async function onSubmit(values: any) {
    setError('');
    setLoading(true);

    const result = await BackendPost(ApiEndpoints.SIGNUP(window?.location.host), {
      username: values.username,
      password: values.password,
      email: values.email,
    });

    if (result?.error) {
      setError(result?.message || 'Failed to Signup.');
      setLoading(false);
    } else {
      const response = await signIn('credentials', {
        email: values?.email,
        password: values?.password,
        redirect: false,
      });

      setLoading(false);
      if (!response?.ok || !response?.url) {
        setError(response?.error || 'Failed to login.');
      } else {
        router.push('/');
      }
    }
  }

  const handleShowPassword = (payload: Partial<ShowPasswordStateT>) => {
    setShowPassword((prevState) => ({ ...prevState, ...payload }));
  };
  return (
    <Container className='h-screen w-screen'>
      <AuthLayout>
        <div className="flex  flex-col space-y-1">
          <h1 className="font-bold text-3xl">Sign Up</h1>
          <p className="text-xs">Create a new account</p>
        </div>

        <form className=" rounded-lg shadow-lg bg-white flex flex-col space-y-3 p-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="font-normal text-xs" htmlFor="username">
              Username
            </label>
            <div className={`  ${styles.input_group} h-10 mt-1`}>
              <input
                type={'text'}
                {...formik.getFieldProps('username')}
                className={` w-full h-full ${styles.input_text}`}
                id="username"
                name="username"
              />
              <span className="icon text-gray-600 flex items-center px-4">
                <HiOutlineUser size={23} />
              </span>
            </div>
            {formik?.errors?.username && formik?.touched?.username ? (
              <span className="text-red-700">{formik?.errors?.username}</span>
            ) : null}
          </div>
          <div>
            <label className="font-normal text-xs" htmlFor="email">
              Email address
            </label>
            <div className={`  ${styles.input_group} h-10 mt-1`}>
              <input
                type={'email'}
                {...formik.getFieldProps('email')}
                className={` w-full h-full ${styles.input_text}`}
                id="email"
                name="email"
              />
              <span className="icon flex text-gray-600 items-center pr-2">
                <HiAtSymbol size={23} />
              </span>
            </div>
            {formik?.errors?.email && formik?.touched?.email ? <span className="text-red-700">{formik?.errors?.email}</span> : null}
          </div>
          <div>
            <label className="font-normal text-xs" htmlFor="password">
              Password
            </label>
            <div className={`${styles.input_group} h-10   mt-1`}>
              <input
                className={` w-full ${styles.input_text}`}
                type={showPassword.newPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
                id="password"
                name="password"
              />
              <span
                className="icon text-gray-600 flex items-center pr-2"
                onClick={() => handleShowPassword({ newPassword: !showPassword.newPassword })}>
                {showPassword ? <AiFillEyeInvisible size={23} /> : <AiFillEye size={25} />}
              </span>
            </div>
            {formik?.errors?.password && formik?.touched?.password ? (
              <span className="text-red-700">{formik?.errors?.password}</span>
            ) : null}
          </div>

          <div>
            <label className="font-normal text-xs" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className={`${styles.input_group} h-10   mt-1`}>
              <input
                {...formik.getFieldProps('confirmPassword')}
                className={` w-full ${styles.input_text}`}
                type={showPassword?.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
              />
              <span
                className="icon text-gray-600 flex items-center pr-2"
                onClick={() => handleShowPassword({ confirmPassword: !showPassword.confirmPassword })}>
                {showPassword ? <AiFillEyeInvisible size={23} /> : <AiFillEye size={25} />}
              </span>
            </div>
            {formik?.errors?.confirmPassword && formik?.touched?.confirmPassword ? (
              <span className="text-red-700">{formik?.errors?.confirmPassword}</span>
            ) : null}
          </div>

          <button
            type="submit"
            className={`bg-black rounded text-white font-semibold text-center h-10 w-full ${styles.button}`}
            disabled={loading}>
            {loading ? <LoaderSvg size="5" /> : 'Sign Up'}
          </button>
          {error ? <span className="text-red-700 text-center">{error}</span> : null}
        </form>
        <div className="text-xs text-center">
          <span>Already have an account?</span>
          <Link href={'/login'}>
            <span className="text-blue-700"> Login</span>
          </Link>
        </div>
      </AuthLayout>
    </Container>
  );
};
