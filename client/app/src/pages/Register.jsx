import Form from '../Components/AuthForm';
import authSvg from '../assets/auth.svg';

function Register() {
    return (
        <div className="page-container">

            <div className="page-left">
                <img src={authSvg} alt="Welcome" style={{ maxWidth: "80%" }} />
            </div>

            <div className="page-right">
                <Form route="/api/user/register/" method="register" />
            </div>

        </div>
    );
}

export default Register;