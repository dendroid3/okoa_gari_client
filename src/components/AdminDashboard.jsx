import React, { useState, useEffect } from 'react';
import { FaChartLine, FaWrench, FaCreditCard, FaClipboardList, FaRegUser, FaUsers, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mechanics, setMechanics] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); // Track if user is signing up or logging in

  // User information states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch data from API or use static data
    setMechanics([
      { id: 1, name: 'Mike Johnson', gender: 'Male', skillset: 'Engine Repair', experience: 5, startDate: '2019-05-01', profilePic: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Sara Lee', gender: 'Female', skillset: 'Bodywork', experience: 3, startDate: '2021-02-15', profilePic: 'https://via.placeholder.com/50' },
      { id: 3, name: 'Chris Martin', gender: 'Male', skillset: 'Electrical Systems', experience: 4, startDate: '2020-07-10', profilePic: 'https://via.placeholder.com/50' },
      { id: 4, name: 'Anna West', gender: 'Female', skillset: 'AC Repair', experience: 2, startDate: '2022-01-20', profilePic: 'https://via.placeholder.com/50' },
      { id: 5, name: 'James Taylor', gender: 'Male', skillset: 'Suspension Repair', experience: 6, startDate: '2018-11-10', profilePic: 'https://via.placeholder.com/50' },
    ]);

    setUsers([
      { id: 1, name: 'John Doe', type: 'User' },
      { id: 2, name: 'Jane Smith', type: 'User' },
      { id: 3, name: 'Bob Lee', type: 'User' },
      { id: 4, name: 'Alice Brown', type: 'User' },
      { id: 5, name: 'Charlie Davis', type: 'User' },
      { id: 6, name: 'Emily White', type: 'User' },
    ]);

    setPayments([
      { id: 1, user: 'John Doe', amount: 50, status: 'Completed' },
      { id: 2, user: 'Jane Smith', amount: 75, status: 'Pending' },
      { id: 3, user: 'Bob Lee', amount: 120, status: 'Completed' },
      { id: 4, user: 'Alice Brown', amount: 200, status: 'Completed' },
      { id: 5, user: 'Charlie Davis', amount: 180, status: 'Completed' },
      { id: 6, user: 'Emily White', amount: 60, status: 'Pending' },
    ]);
  }, []);

  const completedPayments = payments.filter(payment => payment.status === 'Completed').length;
  const pendingPayments = payments.filter(payment => payment.status === 'Pending').length;

  // Analytics Data for Chart.js
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Mechanics',
        data: [5, 6, 7, 8, 9, 10],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Total Payments',
        data: [500, 1200, 1500, 2000, 2500, 3000],
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
      {
        label: 'Total Clients',
        data: [50, 80, 100, 120, 140, 160],
        borderColor: 'rgba(255, 159, 64, 1)',
        fill: false,
      },
    ],
  };

  const handleSignUp = () => {
    // Simulating sign-up logic
    if (name && email && password) {
      localStorage.setItem('userToken', 'new-user-token');
      setIsLoggedIn(true);
      setIsSignUp(false); // Switch to login mode after sign-up
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleLogin = () => {
    // Simulating login logic
    localStorage.setItem('userToken', 'existing-user-token');
    setIsLoggedIn(true);
    setIsSignUp(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setIsSignUp(true); // Reset to sign-up screen after logout
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`w-20 bg-gray-800 p-4 flex flex-col items-center space-y-6 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Admin</h2>
        {/* Sidebar buttons */}
        <button
          onClick={() => setSelectedSection('analytics')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'analytics' ? 'text-white' : ''}`}
        >
          <FaChartLine size={24} />
          <span className="mt-2 text-xs">Analytics</span>
        </button>
        <button
          onClick={() => setSelectedSection('manageMechanics')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'manageMechanics' ? 'text-white' : ''}`}
        >
          <FaWrench size={24} />
          <span className="mt-2 text-xs">Mechanics</span>
        </button>
        <button
          onClick={() => setSelectedSection('payments')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'payments' ? 'text-white' : ''}`}
        >
          <FaCreditCard size={24} />
          <span className="mt-2 text-xs">Payments</span>
        </button>
        <button
          onClick={() => setSelectedSection('serviceStatus')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'serviceStatus' ? 'text-white' : ''}`}
        >
          <FaClipboardList size={24} />
          <span className="mt-2 text-xs">Services</span>
        </button>
        <button
          onClick={() => setSelectedSection('reviews')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'reviews' ? 'text-white' : ''}`}
        >
          <FaUsers size={24} />
          <span className="mt-2 text-xs">Reviews</span>
        </button>
        <button
          onClick={() => setSelectedSection('complaints')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'complaints' ? 'text-white' : ''}`}
        >
          <FaRegUser size={24} />
          <span className="mt-2 text-xs">Complaints</span>
        </button>

        {/* Toggle Sidebar for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
        >
          <FaArrowLeft size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 overflow-hidden">
        <button onClick={() => window.location.href = '/'} className="text-blue-500 hover:text-blue-700 transition p-2 mb-6 flex items-center space-x-2">
          <FaArrowLeft />
          <span>Back to Landing Page</span>
        </button>

        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-600 p-2 rounded text-white"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            {/* Render dashboard sections here */}
            <div>
              {/* Section rendering logic */}
            </div>
          </>
        ) : (
          <div>
            {isSignUp ? (
              <>
                <h2 className="text-2xl mb-4">Sign Up</h2>
                <form>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="p-2 w-full bg-gray-800 rounded border border-gray-700"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 w-full bg-gray-800 rounded border border-gray-700"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-2 w-full bg-gray-800 rounded border border-gray-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="bg-blue-500 p-2 rounded text-white w-full"
                  >
                    Sign Up
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl mb-4">Log In</h2>
                <form>
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 w-full bg-gray-800 rounded border border-gray-700"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-2 w-full bg-gray-800 rounded border border-gray-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="bg-blue-500 p-2 rounded text-white w-full"
                  >
                    Log In
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
