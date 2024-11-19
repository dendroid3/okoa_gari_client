import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from './../UTILS';

const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setRole(queryParams.get('role'));
  }, []);

  const [newUserDetails, setNewUserDetails] = useState({
    'email': '',
    'name': '',
    'password': '',
    'role': role,
  });

  const handleSignUp = async () => {
    // Logic for sign-up (validation, API call)
    // On successful sign-up, store user data and redirect to the appropriate dashboard
    // localStorage.setItem('userToken', 'new-user-token'); // Example token storage
    try {
      // setIsLoggedIn(true);
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserDetails),
      });
      const data = await response.json();
      alert(data.msg)
      // console.log("ok", )
      if(response.ok){
        navigate(`/login?role=${role}`);
      }
      console.log(data)
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
    // navigate(`/${role}-dashboard`);
    console.log(newUserDetails)
  };

  useEffect(() => {
    setNewUserDetails((newUserDetails) => ({
      ...newUserDetails,
      role: role,
    }));
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setNewUserDetails({
        ...newUserDetails,
        [name]: value,
      });
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Sign Up</h2>
        <p className="text-gray-400">You are signing up as a {role}</p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full p-3 bg-yellow-400 text-gray-800 font-semibold rounded-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
