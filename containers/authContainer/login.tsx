import { AiFillEye } from '@react-icons/all-files/ai/AiFillEye';
import { AiFillEyeInvisible } from '@react-icons/all-files/ai/AiFillEyeInvisible';
import { HiAtSymbol } from '@react-icons/all-files/hi/HiAtSymbol';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { LoaderSvg } from '../../components/loaders/CircularLoader';

import { Container } from '../../components';

import GoogleSvg from '../../public/assets/google-icon.svg';
import styles from '../../styles/Form.module.css';
import { AuthLayout } from './AuthLayout';
import { validateLoginInputs } from './helper';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
    validate: validateLoginInputs,
  });
  async function onSubmit(values: any) {
    setError('');
    setLoading(true);
    const response = await signIn('credentials', {
      email: values?.email,
      password: values?.password,
      redirect: false,
    });

    setLoading(false);
    if (!response?.ok || !response?.url) {
      setError(response?.error || 'Failed to login.');
    } else {
      router.push(response?.url);
    }
  }

  const handleGoogleSignin = async () => {
    setGoogleLoading(true);
    await signIn('google', {
      callbackUrl: 'http://localhost:3000',
      redirect: true,
    });
    setGoogleLoading(false);
  };
  return (
    <Container className="h-screen w-screen">
      <AuthLayout>
        <div className="flex  flex-col space-y-1">
          <h1 className="font-bold text-3xl">Sign In</h1>
          <p className="text-xs">Sign in to your account</p>
        </div>
        <button type="button" className={styles.button_custom} onClick={handleGoogleSignin}>
          {googleLoading ? (
            <LoaderSvg type="SECONDARY" size="5" />
          ) : (
            <>
              <Image src={GoogleSvg.src} width="17" className="mt-0.5 mr-2" height={'17'} alt="Google" /> Sign In With Google
            </>
          )}
        </button>
        <form onSubmit={formik.handleSubmit} className=" rounded-lg shadow-lg bg-white flex flex-col space-y-2 p-6">
          <div>
            <label className="font-normal text-xs" htmlFor="email">
              Email address
            </label>
            <div className={`  ${styles.input_group} h-10 mt-1`}>
              <input
                type={'email'}
                // onChange={formik.handleChange}
                // value={formik.values.email}
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
                // onChange={formik.handleChange}
                // value={formik.values.password}
                {...formik.getFieldProps('pasword')}
                className={` w-full ${styles.input_text}`}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
              />
              <span className="icon text-gray-600 flex items-center pr-2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <AiFillEyeInvisible size={23} /> : <AiFillEye size={25} />}
              </span>
            </div>
            {formik?.errors?.password && formik?.touched?.password ? (
              <span className="text-red-700">{formik?.errors?.password}</span>
            ) : null}
          </div>
          <p className="text-xs text-blue-700 font-normal">Forget Password?</p>

          <button
            type="submit"
            disabled={loading}
            className={`bg-black ${
              loading ? 'cursor-not-allowed' : 'cursor-pointer'
            } rounded text-white font-semibold flex items-center justify-center h-10 w-full ${styles.button}`}>
            {loading ? <LoaderSvg size="5" /> : 'Sign In'}
          </button>
          {error ? <span className="text-red-700 text-center">{error}</span> : null}
        </form>

        <div className="text-xs text-center">
          <span>Don&apos;t have an account?</span>
          <Link href={'/signup'}>
            <span className="text-blue-700"> Register</span>
          </Link>
        </div>
      </AuthLayout>
    </Container>
  );
};
