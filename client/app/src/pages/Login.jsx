import AuthForm from '../Components/AuthForm';
import authSvg from '../assets/auth.svg';

function Login() {
    return (
        <div className="page-container">

            <div className="page-left">
                <img src={authSvg} alt="Welcome" style={{ maxWidth: "80%" }} />
            </div>

            <div className="page-right">
                <AuthForm route="/api/token/" method="login" />
            </div>

        </div>
    );
}

export default Login;