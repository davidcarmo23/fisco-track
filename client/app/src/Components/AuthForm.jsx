import { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import '../App.css';
import '../styles/AuthForm.css';

function AuthForm({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {

            if (method == 'login') {
                const res = await api.post(route, {
                    username, password
                });

                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                navigate("/");
            } else {

                const res = await api.post(route, {
                    username, password, firstName, lastName, email
                });

                navigate("/login")
            }

        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    if (method === "login") {
        return (
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Hello!</h2>
                <div className="fieldsHolder">
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Login</button>
                </div>

                <div className="authRedirect">
                    <a href="#">Sign Up to Get Started</a>
                    <a href="#">Forgot Password?</a>
                </div>


            </form>

        );
    } else if (method === "register") {
        return (
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                <div className="fieldsHolder">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Register</button>

                    <div className="authRedirect">
                        <a href="#">Already have an account?</a>
                    </div>
                </div>
            </form>
        );
    } else {
        return null;
    }
}

export default AuthForm;
