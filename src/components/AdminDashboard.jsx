import React, { useState, useEffect } from 'react';
import { FaChartLine, FaWrench, FaCreditCard, FaComments, FaClipboardList, FaRegUser, FaUsers, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import BASE_URL from '../UTILS';
import 'chart.js/auto';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('manageMechanics');
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
  const [serviceReviews, setServiceReviews] = useState({});

  const fetchServiceReviews = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/service_user/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log(response)
      const data = await response.json()

      console.log('data', data)
      if(response.ok){
        setServiceReviews(data)
        // alert('service added successfully')
        // getUserVehicles()
      }
      console.log(response)
    } catch (error) {
      // alert('Could not add service. Pleaase try again')
      console.log(error)
    }
  }

  const handleDeleteGarage = async (garage) => {
    const confirmationMessage = "You are about to delete this garage. Proceed?"

    if(!confirm(confirmationMessage)){
      return
    }

    const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/users/${garage.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(garage),
        });

        if(response.ok){
          alert('garage deleleted successfully')
          fetchAllMechanics()
          fetchAllServices()
        }
        console.log(response)
      } catch (error) {
        alert('Could not delete garage. Pleaase try again')
      }
  }

  const handleDeleteService = async (service) => {
    const confirmationMessage = "You are about to delete this service. Proceed?"

    if(!confirm(confirmationMessage)){
      return
    }

    const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/services/${service.service_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(service),
        });

        if(response.ok){
          alert('service deleleted successfully')
          fetchAllServices()
        }
        console.log(response)
      } catch (error) {
        alert('Could not delete service. Pleaase try again')
      }
  }

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

  const [realMechanics, setRealMechanics ] = useState([])

  const fetchAllMechanics = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/mechanics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log(response)
      const data = await response.json()

      console.log('data', data)
      if(response.ok){
        if (Array.isArray(data)) {
          setRealMechanics(data);
        } else {
          console.error('Expected an array of services');
        }
      }
      console.log(response)
    } catch (error) {
      // alert('Could not add service. Pleaase try again')
      console.log(error)
    }
  }

  const [services, setServices ] = useState([])

  const fetchAllServices = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/services/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log(response)
      const data = await response.json()

      console.log('data', data)
      if(response.ok){
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Expected an array of services');
        }
      }
      console.log(response)
    } catch (error) {
      // alert('Could not add service. Pleaase try again')
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllServices()
    fetchAllMechanics()
    fetchServiceReviews()
  }, [])

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`w-20 bg-gray-800 p-4 flex flex-col items-center space-y-6 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Admin</h2>
        {/* Sidebar buttons */}
        <button
          onClick={() => setSelectedSection('manageMechanics')}
          className={`text-gray-400 hover:text-white flex flex-col items-center ${selectedSection === 'manageMechanics' ? 'text-white' : ''}`}
        >
          <FaWrench size={24} />
          <span className="mt-2 text-xs">Garages</span>
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
          <FaComments size={24} />
          <span className="mt-2 text-xs">Reviews</span>
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

        <div>
          {selectedSection === 'manageMechanics' && (
            <div>
              {/* Content for 'manageMechanics' */}
              <h1>Manage Garages</h1>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-3 text-center">Garage</th>
                    <th className="border p-3 text-center">Email</th>
                    <th className="border p-3 text-center">Number of Services</th>
                    <th className="border p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {realMechanics.map((garage, index) => (
                    <tr key={index}>
                      {/* <td className="border p-3 text-center">{garage.}</td> */}
                      <td className="border p-3 text-center">{garage.name}</td>
                      <td className="border p-3 text-center">{garage.email}</td>
                      <td className="border p-3 text-center">{garage.number_of_services}</td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => handleDeleteGarage(garage)} 
                          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                        >
                          Delete Garage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedSection === 'serviceStatus' && (
            <div>
              {/* Content for 'serviceStatus' */}
              <h1>Manage Services</h1>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-3 text-center">Garage</th>
                    <th className="border p-3 text-center">Service Name</th>
                    <th className="border p-3 text-center">Location</th>
                    <th className="border p-3 text-center">Cost</th>
                    <th className="border p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td className="border p-3 text-center">
                      {service.user_name}<br></br>
                      {service.user_email}<br></br>
                      </td>
                      <td className="border p-3 text-center">{service.service_name}</td>
                      <td className="border p-3 text-center">{service.service_location}</td>
                      <td className="border p-3 text-center">{service.service_cost}</td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => handleDeleteService(service)} 
                          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                        >
                          Delete Service
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
            </div>
          )}

          {selectedSection === 'reviews' && (
            <div>
              {/* Content for 'serviceStatus' */}
              <h1>Service Reviews</h1>
              <div style={{ maxHeight: '80vh', overflowY: 'auto', marginBottom: '50rem', paddingBottom: '5rem'}}>
                  <table className="w-full border-collapse mb-4">
                    <thead>
                      <tr>
                        <th className="border p-3 text-center">Garage</th>
                        <th className="border p-3 text-center">Customer</th>
                        <th className="border p-3 text-center">Service</th>
                        <th className="border p-3 text-center">Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceReviews.map((review, index) => (
                        <tr key={index}>
                          <td className="border p-3 text-center">
                            {review.garage.garage_name}<br />
                            {review.garage.garage_email}<br />
                          </td>
                          
                          <td className="border p-3 text-center">
                            {review.customer.customer_name}<br />
                            {review.customer.customer_email}<br />
                          </td>
                          
                          <td className="border p-3 text-center">
                            {review.service.service_name}<br />
                            {review.service.service_location}<br />
                            {review.service.service_cost}<br />
                          </td>
                          
                          <td className="border p-3 text-center">
                            {review.review_comment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
