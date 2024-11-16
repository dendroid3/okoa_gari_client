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

  // const [contactDetails, setContactDetails] = useState(userProfile.contact);
  // const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [review, setReview] = useState('');
  const [complaint, setComplaint] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('profile'); // Default section is 'profile'
  const [paymentStatus, setPaymentStatus] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userServices, setUserServices] = useState([])

  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  const { name, email, location } = storedUserData || {};

  // Initialize state with the destructured properties
  const [contactDetails, setContactDetails] = useState({
    name: name || '',
    email: email || '',
    location: location || ''
  });

  
  const [userVehicles, setUserVehicles] = useState([]);

  const [newCarDetails, setNewCarDetails] = useState({
    'make': 'make' || '',
    'model': 'model' || '',
    'year': 2020 || null,
    'registration': 'registration' || '',
    'transmission': 'transmission' || '',
    'fuel_type': 'fuel_type' || '',
  })
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
  }, [])

  // const services = [
  //   { id: 1, type: 'towing', name: 'Car Towing' },
  //   { id: 2, type: 'mechanical', name: 'Flat Tire Fix' },
  //   { id: 3, type: 'towing', name: 'Heavy Duty Towing' },
  //   { id: 4, type: 'mechanical', name: 'Engine Diagnostics' },
  //   { id: 5, type: 'mechanical', name: 'Battery Jumpstart' },
  // ];

  // Handle car details update
  // const handleVehicleDetailsChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewCarDetails((prevDetails) => ({
  //     ...prevDetails,
  //     [name]: value,
  //   }));
  // };

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicle_id: null, // Initial value for vehicle_id
  });

  const [vehicleServiceDetails, setVehicleServiceDetails] = useState({
    vehicle_id: null, 
    service_id: null// Initial value for vehicle_id
  });

  const handleVehicleDetailsChange = (event) => {
    const { name, value } = event.target;
    // Update the object with the selected vehicle's ID
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleVehicleServiceDetailsChange = (event) => {
    const { name, value } = event.target;
    // Update the object with the selected vehicle's ID
    setVehicleServiceDetails((prevDetails) => ({
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

  const handleUpdateUserDetails = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const user_data = JSON.parse(localStorage.getItem('userData'));
      console.log("user_data", user_data)
      const user_id = user_data.id
      if (!user_id) {
        console.error('Log in again');
        return;
      }
  
  
      const response = await fetch(`${BASE_URL}/auth/user?user_id=${user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactDetails),
      });

      const data = await response.json()
      console.log(`data`, data)

      if (response.ok) 
      { 
        alert("Details successfully saved.")
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

    } catch (error) {
      console.log(error)
    }
  }

  // Handle service request
  const handleServiceRequest = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await fetch(`${BASE_URL}/service_user/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicleServiceDetails),
    });
    const data = await response.json()

    alert(data.msg)

    console.log(data)
  };

  const fetchMyServices = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await fetch(`${BASE_URL}/service_user/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data = await response.json()

    console.log('fetch my services', data)
    // alert(data.msg)
    if(response.ok){
      setUserServices(data)
    }

  }

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

  const handleAddCar = async () => {
    {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      try {
        const response = await fetch(`${BASE_URL}/cars/mine`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newCarDetails),
        });

        if(response.ok){
          alert('car added successfully')
          getUserVehicles()
        }
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const getUserVehicles = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/cars/mine`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json()
      console.log(`data`, data)
      setUserVehicles(data.vehicles)

      // setVehicleDetails(data[0])

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserVehicles()
    fetchMyServices()
  }, []);


  // Render the active section content
  const renderSection = () => {
    switch (activeSection) {
      case 'profile': 
        return (
          <>
            <h4 className="text-lg font-medium mt-6">Contact Details</h4>
            {['name', 'email', 'location'].map((field) => (
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

             <button
              // onClick={() => {
              //   setUserProfile({ car: vehicleDetails, contact: contactDetails });
              //   alert('Profile updated!');
              // }}
              onClick={handleUpdateUserDetails}
              className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </>
        );
      
      case 'car':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900">Cars Information</h3>
            <div className="mt-4">
              <h4 className="text-lg font-medium">Cars Details</h4>
              { !userVehicles[0] && <>
                You have no cars added yet
              </>}
              <div>
                {userVehicles.map((car, index) => (
                      <div className="mt-4">
                        <div>
                          {`Car ${index + 1}`}
                        </div>
                        {['make', 'model', 'year', 'registration', 'transmission', 'fuel_type'].map((field) => {
                          if (field !== 'fuel_type' && field !== 'transmission' && field !== 'year') {
                            return (
                              <input
                                key={field}
                                disabled
                                type="text"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                className="p-3 border mt-2 w-full rounded-md"
                                value={car[field]}
                                onChange={handleVehicleDetailsChange}
                              />
                            );
                          } else if (field === 'year') {
                            return (
                              <input
                                key={field}
                                disabled
                                type="number"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                className="p-3 border mt-2 w-full rounded-md"
                                value={car[field]}
                                onChange={handleVehicleDetailsChange}
                              />
                            );
                          }else if (field === 'transmission') {
                            return (
                              <select
                                key={field}
                                disabled
                                className="p-3 border mt-2 w-full rounded-md"
                                name="transmission"
                                value={car[field]}
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
                                disabled
                                className="p-3 border mt-2 w-full rounded-md"
                                name="fuel_type"
                                value={car[field]}
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
                  ))}
              </div>
              
              <h4 className="text-lg font-medium">Add Car</h4>

              {['make', 'model', 'year', 'registration', 'transmission', 'fuel_type'].map((field) => {
                if (field !== 'fuel_type' && field !== 'transmission' && field !== 'year') {
                  return (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="p-3 border mt-2 w-full rounded-md"
                      value={newCarDetails[field]}
                      onChange={handleVehicleDetailsChange}
                    />
                  );
                } else if (field === 'year') {
                  return (
                    <input
                      key={field}
                      type="number"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="p-3 border mt-2 w-full rounded-md"
                      value={newCarDetails[field]}
                      onChange={handleVehicleDetailsChange}
                    />
                  );
                }else if (field === 'transmission') {
                  return (
                    <select
                      key={field}
                      className="p-3 border mt-2 w-full rounded-md"
                      name="transmission"
                      value={newCarDetails[field]}
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
                      value={newCarDetails[field]}
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
              <button
                onClick={handleAddCar}
                className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
              >
                Add Car
              </button>
            </div>


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

            <div className="relative mt-4">
              <select
                className="p-3 border mt-2 w-full rounded-md"
                name="vehicle_id"
                onChange={handleVehicleServiceDetailsChange}
                required
              >
                <option value="">Select a Vehicle</option>
                {userVehicles.map((car, index) => (
                  <option key={car.id} value={car.id}>
                    {`${index + 1}: ${car.model} (${car.year})`}
                  </option>
                ))}
              </select>
              <p className="mt-2">
                Selected Vehicle ID: {vehicleServiceDetails.vehicle_id}
              </p>
            </div>

            <div className="relative mt-4">
              {Array.isArray(services) && services.length > 0 ? (
                <select className="p-3 border mt-2 w-full rounded-md" onChange={handleVehicleServiceDetailsChange} name="service_id">
                  {services.map((service, index) => (
                    <option key={index} value={service.service_id}>
                      {`${service.service_name} - ${service.service_cost} (${service.user_name} - ${service.user_location})`}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No services available</p>
              )}
            </div>
            <button
              onClick={handleServiceRequest}
              className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-blue-600 transition"
            >
              Request Service
            </button>
          </div>
        );
      case 'requestHistory':
        return (
          <div className="p-4">
            
            <h3 className="text-xl font-semibold text-gray-900">Request History</h3>
            <ul>
              {userServices.map((request) => (
                <li key={request.id} className="mt-4 p-4 border rounded-md">
                  <p><strong>Service:</strong> {request.service_name}</p>
                  <p><strong>Car:</strong> {`${request.vehicle_model} (${request.vehicle_year})`}</p>
                  <p><strong>Cost:</strong> {request.service_cost}</p>
                  <p><strong>Mechanic Name:</strong> {request.mechanic_name}</p>
                  <p><strong>Mechanic Location:</strong> {request.mechanic_location}</p>
                  <p><strong>Mechanic Email:</strong> {request.mechanic_email}</p>
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
