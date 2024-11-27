import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
        </Routes>
    );
};

export default App;
