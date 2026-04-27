import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const validUsername = "user";
    const validPassword = "pass";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === validUsername && password === validPassword) {
            setMessage("Login successful!");
            navigate('/Dash')
        } else {
            setMessage("Invalid username or password.");
        }
    };

    return (
        <div>
            <h2>Login hello</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
