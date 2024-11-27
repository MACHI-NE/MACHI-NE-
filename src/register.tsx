import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import md5 from "md5";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (username && password) {
            const hashedPassword = md5(password); // Hash the password
            const users = JSON.parse(localStorage.getItem("users") || "[]") as Array<{
                username: string;
                password: string;
            }>;

            if (users.some((user) => user.username === username)) {
                alert("Username already exists!");
                return;
            }

            users.push({ username, password: hashedPassword });
            localStorage.setItem("users", JSON.stringify(users));

            alert("User registered successfully!");
            setUsername("");
            setPassword("");
            navigate("/login");
        } else {
            alert("Please fill out both fields.");
        }
    };

    return (
        <div className="registerContainer">
            <form onSubmit={handleSubmit}>
                <h3>Register</h3>
                <label>Username</label>
                <input
                    type="text"
                    className="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    className="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="createButton">
                    Create
                </button>
            </form>
        </div>
    );
};

export default Register;
