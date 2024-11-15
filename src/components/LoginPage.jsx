import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from './../UTILS';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleFromUrl = queryParams.get('role');
    if (!roleFromUrl) {
      alert("Role not specified. Redirecting...");
      navigate('/');
      return;
    }
    setRole(roleFromUrl);
  }, [location]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {

      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });
      // const data = await response.json();

      // Replace with your actual login logic
      if (response) {
        const data = await response.json()
        const access_token = data.access_token
      
        localStorage.setItem('userToken', access_token);
        localStorage.setItem('userData', data);
        
        navigate(`/${role}-dashboard`);
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSignUp = () => {
    navigate(`/signup?role=${role}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Login</h2>
        <p className="text-gray-400">You are logging in as a {role}</p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            aria-label="Email Address"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={handleLogin}
            disabled={!email || !password}
            className="w-full p-3 bg-yellow-400 text-gray-800 font-semibold rounded-lg"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full p-3 bg-yellow-400 text-gray-800 font-semibold rounded-lg"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;