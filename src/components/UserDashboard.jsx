import React, { useState, useEffect } from 'react';
import { FaCar, FaUserAlt, FaHistory, FaRegClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import BASE_URL from './../UTILS';

const UserDashboard = () => {
  // Mock user data
  const [userProfile, setUserProfile] = useState({
    car: {
      name: 'Toyota',
      model: 'Corolla',
      year: '2020',
      registration: 'XYZ1234',
      vin: '1HGBH41JXMN109186', // Mock VIN
      color: 'Silver',
      insurance: 'State Farm',
      expiry: '12/12/2024', 
      engine: 'BMW V-12 Super-Charger',
      transmission: 'Manual',
      fuel_type: "Petrol"
    },
    contact: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    },
  });

  const [vehicleDetails, setVehicleDetails] = useState(userProfile.car);
  const [contactDetails, setContactDetails] = useState(userProfile.contact);
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [review, setReview] = useState('');
  const [complaint, setComplaint] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('car'); // Default section is 'profile'
  const [paymentStatus, setPaymentStatus] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const services = [
    { id: 1, type: 'towing', name: 'Car Towing' },
    { id: 2, type: 'mechanical', name: 'Flat Tire Fix' },
    { id: 3, type: 'towing', name: 'Heavy Duty Towing' },
    { id: 4, type: 'mechanical', name: 'Engine Diagnostics' },
    { id: 5, type: 'mechanical', name: 'Battery Jumpstart' },
  ];

  // Handle car details update
  const handleVehicleDetailsChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle contact details update
  const handleContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle service request
  const handleServiceRequest = () => {
    if (!serviceType) {
      alert('Please select a service first!');
      return;
    }

    setRequestStatus('Request sent!');
    setPaymentStatus('Pending');

    const newRequest = {
      id: Date.now(),
      service: serviceType,
      status: 'Requested',
      paymentStatus: 'Pending',
      review: review || 'No review provided',
      complaint: '',
      date: new Date().toLocaleString(),
    };

    setRequestHistory((prevHistory) => [...prevHistory, newRequest]);
  };

  // Handle payment completion
  const handlePayment = (requestId) => {
    setPaymentStatus('Completed');
    setRequestHistory((prevHistory) =>
      prevHistory.map((request) =>
        request.id === requestId ? { ...request, paymentStatus: 'Completed' } : request
      )
    );
    alert('Payment successful!');
  };

  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleDetails),
      });

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateVehicle = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/vehicles`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleDetails),
      });

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const getUserVehicle = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/vehicles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json()
      console.log(`data`, data)

      setVehicleDetails(data[0])

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserVehicle()
  }, []);


  // Render the active section content
  const renderSection = () => {
    switch (activeSection) {
      case 'profile': 
        return (
          <>
            <h4 className="text-lg font-medium mt-6">Contact Details</h4>
            {['name', 'email', 'phone'].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-3 border mt-2 w-full rounded-md"
                value={contactDetails[field]}
                onChange={handleContactDetailsChange}
              />
            ))}
          </>
        );
      
      case 'car':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            <div className="mt-4">
              <h4 className="text-lg font-medium">Car Details</h4>

              {['name', 'model', 'registration', 'engine', 'transmission', 'fuel_type'].map((field) => {

                if (field !== 'fuel_type' && field !== 'transmission') {
                  return (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="p-3 border mt-2 w-full rounded-md"
                      value={vehicleDetails[field]}
                      onChange={handleVehicleDetailsChange}
                    />
                  );
                } else if (field === 'transmission') {
                  return (
                    <select
                      key={field}
                      className="p-3 border mt-2 w-full rounded-md"
                      name="transmission"
                      value={vehicleDetails[field]}
                      onChange={handleVehicleDetailsChange}
                      required
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  );
                } else if (field === 'fuel_type') {
                  return (
                    <select
                      key={field}
                      className="p-3 border mt-2 w-full rounded-md"
                      name="fuel_type"
                      value={vehicleDetails[field]}
                      onChange={handleVehicleDetailsChange}
                      required
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  );
                }

                return null;
              })}

            </div>

            {/* <h4 className="text-lg font-medium mt-6">Contact Details</h4>
            {['name', 'email', 'phone'].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-3 border mt-2 w-full rounded-md"
                value={contactDetails[field]}
                onChange={handleContactDetailsChange}
              />
            ))} */}

            <button
              // onClick={() => {
              //   setUserProfile({ car: vehicleDetails, contact: contactDetails });
              //   alert('Profile updated!');
              // }}
              onClick={handleUpdateVehicle}
              className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </div>
        );
      case 'requestService':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900">Request Service</h3>
            <div className="mt-4">
              <h4 className="text-lg font-medium">Vehicle Details</h4>
              {['make', 'model', 'year', 'registration', 'vin', 'color', 'insurance', 'expiry'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="p-3 border mt-2 w-full rounded-md"
                  value={vehicleDetails[field]}
                  onChange={handleVehicleDetailsChange}
                />
              ))}
            </div>

            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Search for Towing or Mechanical services"
                className="p-3 border w-full rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                  {services.filter(service => service.name.toLowerCase().includes(searchQuery.toLowerCase())).map((service) => (
                    <div key={service.id} className="border-b py-2">
                      <button
                        onClick={() => {
                          setServiceType(service.name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-200"
                      >
                        {service.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {serviceType && (
              <div className="mt-4">
                <h4 className="text-lg font-medium">Selected Service: {serviceType}</h4>
                <button
                  onClick={handleServiceRequest}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-blue-600 transition"
                >
                  Request Service
                </button>
              </div>
            )}
          </div>
        );
      case 'requestHistory':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900">Request History</h3>
            <ul>
              {requestHistory.map((request) => (
                <li key={request.id} className="mt-4 p-4 border rounded-md">
                  <p><strong>Service:</strong> {request.service}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                  <p><strong>Payment Status:</strong> {request.paymentStatus}</p>
                  <p><strong>Date:</strong> {request.date}</p>
                  <p><strong>Review:</strong> {request.review}</p>
                  <p><strong>Complaint:</strong> {request.complaint}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="w-1/4 bg-gray-900 text-white p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Dashboard</h3>
        <ul className="space-y-4">
          {[
            { name: 'Profile', icon: <FaUserAlt />, section: 'profile' },
            { name: 'Car', icon: <FaCar />, section: 'car' },
            { name: 'Services', icon: <FaCar />, section: 'requestService' },
            { name: 'History', icon: <FaHistory />, section: 'requestHistory' },
            { name: 'Appointments', icon: <FaRegClock />, section: 'appointments' },
            { name: 'Location', icon: <FaMapMarkerAlt />, section: 'location' }
          ].map(({ name, icon, section, onClick }) => (
            <li key={section}>
              <button
                onClick={onClick || (() => setActiveSection(section))}
                className={`flex items-center space-x-3 p-3 text-lg rounded-md w-full hover:bg-gray-700 transition ${
                  activeSection === section ? 'bg-gray-700' : ''
                }`}
              >
                <span>{icon}</span>
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-gray-100 p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-500 hover:text-blue-700 transition p-2"
          >
            <FaArrowLeft /> Back to Landing Page
          </button>
        </div>
        {renderSection()}
      </div>
    </div>
  );
};

export default UserDashboard;
