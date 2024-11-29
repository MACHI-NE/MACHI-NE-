import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import md5 from "md5";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users") || "[]") as Array<{
            username: string;
            password: string;
        }>;

        const hashedPassword = md5(password);
        const user = users.find(
            (user) => user.username === username && user.password === hashedPassword
        );

        if (user) {
            alert("Login successful!");



            navigate("/dashboard"); // HOWARDS PLEASE CHANGE THIS TO THE MAIN WEBSITE



        } else {
            alert("Invalid username or password.");
        }
    };

    return (
        <div className="loginContainer">
            <form onSubmit={handleLogin}>
                <h3>Login</h3>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    className="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-label="Username"
                    placeholder="Enter your username"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    className="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    placeholder="Enter your password"
                />
                <button type="submit" className="loginButton">
                    Login
                </button>

                <Link to="/register"> Not a member, sign up!</Link>
            </form>
        </div>
    );
};

export default Login;
