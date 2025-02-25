import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.module.css';
import Field from '../../components/field';

function SignIn() {
  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <p className="h1 head">Sign In</p>
        <Field textField="Name"/>
        <Field textField="Password"/>
      </div>
    </div>
  );
}

export default SignIn;