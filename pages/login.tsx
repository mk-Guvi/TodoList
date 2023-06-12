import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { BrowserHeader } from '../components';
import { Login } from '../containers/authContainer';
function LoginPage() {
  return (
    <>
      <BrowserHeader title="Login" />
      <Login />
    </>
  );
}

export default LoginPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
