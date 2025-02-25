import 'bootstrap/dist/css/bootstrap.min.css'
import './SignUp.module.css';
function SignUp(){
  return (
    <div className="sign-up-container container">
          <div className="sign-up-content">
            <p className="h1 head">Sign Up</p>
            <Field textField="Name"/>
            <Field textField="Email"/>
            <Field textField="Password"/>
          </div>
        </div>
  )
}

export default SignUp