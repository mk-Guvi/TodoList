import { BrowserHeader } from '../components';
import { Signup } from '../containers/authContainer';

function SignupPage() {
  return (
    <>
      <BrowserHeader title="Signup" />
      <Signup />
    </>
  );
}

export default SignupPage;
