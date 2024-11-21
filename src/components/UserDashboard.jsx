import React, { useState, useEffect } from 'react';
import { FaCar, FaUserAlt, FaHistory, FaRegClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from "react-bootstrap";  
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

  const handleDeleteCar = async (e) => {
    const confirmationMessage = "You are about to delete this car. Proceed?"

    if(!confirm(confirmationMessage)){
      return
    }

    const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cars/mine/${carToBeEdited.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(carToBeEdited),
        });


        if(response.ok){
          alert('car deleleted successfully')
          getUserVehicles()   
          fetchMyServices()
          setIsEditCarModalOpen(0)
        }
        console.log(response)
      } catch (error) {
        alert('Could not delete car. Pleaase try again')
        console.log(error)
      }
  }
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
  });

  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);

    // Filter services based on the selected location
    const servicesInLocation = services.filter(service => service.service_location === location);
    setFilteredServices(servicesInLocation);
  };


  
  const [userVehicles, setUserVehicles] = useState([]);

  const [newCarDetails, setNewCarDetails] = useState({
    'make': '',
    'model': '',
    'year': null,
    'registration': '',
    'transmission': '',
    'fuel_type': '',
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

  const [carToBeEdited, setCarToBeEdited] = useState({
    make: '',
    model: '',
    year: '',
    registration: '',
    transmission: '',
    fuel_type: '',
  })

  const [isEditCarModalOpen, setIsEditCarModalOpen] = useState(false)
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false)
  const [isReviewGarageOpen, setIsReviewGarageOpen] = useState(false)
  const [userServiceReview, setServiceUserReview] = useState({})

  const handleOpenReviewModal = (user_service) => {
    setIsReviewGarageOpen(true)
    setServiceUserReview(user_service)
  }

  const handleCloseReviewModal = () => setIsReviewGarageOpen(false);

  const handleServiceReviewInputChange = (event) => {
    const {name, value} = event.target
    setServiceUserReview((prevDetails) =>({
      ...prevDetails,
      [name]: value
    }))
  }

  const handleSendReview = async (e) => {
    e.preventDefault()
    const data = {}
    data.service_user_id = userServiceReview.id,
    data.comment = userServiceReview.comment
    console.log(data)

    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/service_user/add_review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json()
      console.log(responseData)

      if(response.ok){
        alert("Review Updated Successfully.")
        setIsReviewGarageOpen(false)
        getUserVehicles()   
        fetchMyServices()
        // setIsEditCarModalOpen(false)
        // getUserVehicles()
      }

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleToogleEditCarModal = (car) => {
    if(car){
      setCarToBeEdited(car)
      setIsEditCarModalOpen(true)
    } else {
      setIsEditCarModalOpen(false)
    }
  }

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicle_id: null, // Initial value for vehicle_id
  });

  const handleEditCarDetailsInputChange = (event) => {
    const {name, value} = event.target
    setCarToBeEdited((prevDetails) =>({
      ...prevDetails,
      [name]: value
    }))
  }

  const handleUpdateVehicle = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const data = carToBeEdited
      const response = await fetch(`${BASE_URL}/cars/mine/${carToBeEdited.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json()

      if(response.ok){
        alert("Car Details Updated Successfully.")
        setIsEditCarModalOpen(false)
        getUserVehicles()   
        fetchMyServices()
      }

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const [vehicleServiceDetails, setVehicleServiceDetails] = useState({
    vehicle_id: null, 
    service_id: null// Initial value for vehicle_id
  });

  const handleVehicleDetailsChange = (event) => {
    const { name, value } = event.target;
    // Update the object with the selected vehicle's ID
    setNewCarDetails((prevDetails) => ({
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

    console.log("vehicleServiceDetails", vehicleServiceDetails)
    const response = await fetch(`${BASE_URL}/service_user/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicleServiceDetails),
    });
    const data = await response.json()
    getUserVehicles()   
    fetchMyServices()
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
  const handlePayment = async (request) => {
    const confirmationMessage =`You are about to pay ${request.garage_name} KES ${request.service_cost} for ${request.service_name}\nProceed?`
    if(!confirm(confirmationMessage)){
      return
    }

    const phoneNumber = prompt("Enter Phone Number beginning with 0")

    const phonePattern = /^(07|01)\d{8}$/;

    if(!phonePattern.test(phoneNumber)) {
        alert(("Invalid phone number. Please enter a 10-digit number starting with 07 or 01."))
        handlePayment(request)
        return
    } else {
        console.log("Valid phone number");
    }

    const paymentData = {
      service_user_id: request.id,
      amount: request.service_cost,
      phone: phoneNumber
    }

    
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/services/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });

      console.log(response)
      getUserVehicles()   
        fetchMyServices()
      alert("Service paid successfully")
    } catch (error) {
      console.log(error)
    }
  };

  const handleNewCarDetailsChange = (event) => {
    const { name, value } = event.target;
    // Update the object with the selected vehicle's ID
    setNewCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

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

  const handleAddCar = async (e) => {
    {
      e.preventDefault()
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
          setIsAddCarModalOpen(0)
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
            {['name', 'email'].map((field) => (
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Cars Information</h3>
              <button
                onClick={setIsAddCarModalOpen}
                className="bg-green-500 text-white py-2 px-6 ml-4 rounded-lg mt-0 hover:bg-green-600 transition"
              >
                Add Car
              </button>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-medium">Cars Details</h4>
              <div>
              {userVehicles.length === 0 ? (
                <p>You have no cars added yet</p>                
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3">Make</th>
                      <th className="border p-3">Model</th>
                      <th className="border p-3">Year</th>
                      <th className="border p-3">Registration</th>
                      <th className="border p-3">Transmission</th>
                      <th className="border p-3">Fuel</th>
                      <th className="border p-3">Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {userVehicles.map((vehicle, index) => (
                      <tr key={index}>
                        <td className="border p-3 text-center">{vehicle.make}</td>
                        <td className="border p-3 text-center">{vehicle.model}</td>
                        <td className="border p-3 text-center">{vehicle.year}</td>
                        <td className="border p-3 text-center">{vehicle.registration}</td>
                        <td className="border p-3 text-center">{vehicle.transmission}</td>
                        <td className="border p-3 text-center ">{vehicle.fuel_type}</td>
                        <td className="border p-3 flex items-center justify-center">
                          <button
                            onClick={() => handleToogleEditCarModal(vehicle)} 
                            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                          >
                            Edit Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
              {/* Add Car Modal */}
              <Modal show={isAddCarModalOpen} onHide={() => setIsAddCarModalOpen(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Car</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>              
                  <Form onSubmit={handleAddCar}>
                    {['make', 'model', 'year', 'registration', 'transmission', 'fuel_type'].map((field) => {
                      if (field !== 'fuel_type' && field !== 'transmission' && field !== 'year') {
                        return (
                          <Form.Group controlId={`car${field}`}>
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={`Enter Car ${field}`}
                              name={field}
                              value={newCarDetails[field]}
                              onChange={handleNewCarDetailsChange}
                              required
                            />
                          </Form.Group>
                        )
                      } else if (field === 'year') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder={`Enter Car ${field}`}
                              name={field}
                              value={newCarDetails[field]}
                              onChange={handleNewCarDetailsChange}
                              required
                            />
                          </Form.Group>
                        )
                      } else if (field === 'transmission') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Select
                              aria-label={`Select Car ${field}`}
                              name={field}
                              value={newCarDetails[field]}
                              onChange={handleNewCarDetailsChange}
                              required
                            >
                              <option value="Manual">Manual</option>
                              <option value="Automatic">Automatic</option>
                            </Form.Select>
                          </Form.Group>
                        )
                      } else if (field === 'fuel_type') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>Fuel Type</Form.Label>
                            <Form.Select
                              aria-label={`Select Car Feul Type`}
                              name={field}
                              value={newCarDetails[field]}
                              onChange={handleNewCarDetailsChange}
                              required
                            >
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                            </Form.Select>
                          </Form.Group>
                        )
                      }
                      })}
                  
                    <Button
                      className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
                      type="submit"
                    >
                      Add Car
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>

              {/* Edit Car Modal */}
              <Modal show={isEditCarModalOpen} onHide={handleToogleEditCarModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Car Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>              
                  <Form onSubmit={handleUpdateVehicle}>
                    {['make', 'model', 'year', 'registration', 'transmission', 'fuel_type'].map((field) => {
                      if (field !== 'fuel_type' && field !== 'transmission' && field !== 'year') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={`Enter Car ${field}`}
                              name={field}
                              value={carToBeEdited[field]}
                              onChange={handleEditCarDetailsInputChange}
                              required
                            />
                          </Form.Group>
                        )
                      } else if (field === 'year') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder={`Enter Car ${field}`}
                              name={field}
                              value={carToBeEdited[field]}
                              onChange={handleEditCarDetailsInputChange}
                              required
                            />
                          </Form.Group>
                        )
                      } else if (field === 'transmission') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Select
                              aria-label={`Select Car ${field}`}
                              name={field}
                              value={carToBeEdited[field]}
                              onChange={handleEditCarDetailsInputChange}
                              required
                            >
                              <option value="Manual">Manual</option>
                              <option value="Automatic">Automatic</option>
                            </Form.Select>
                          </Form.Group>
                        )
                      } else if (field === 'fuel_type') {
                        return (
                          <Form.Group controlId="carMake">
                            <Form.Label>Fuel Type</Form.Label>
                            <Form.Select
                              aria-label={`Select Car Feul Type`}
                              name={field}
                              value={carToBeEdited[field]}
                              onChange={handleEditCarDetailsInputChange}
                              required
                            >
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                            </Form.Select>
                          </Form.Group>
                        )
                      }
                      })}
                  
                    <div className="flex justify-between">  
                      <Button
                        className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
                        type="submit"
                      >
                        Edit Car
                      </Button>
                      <Button
                        onClick={handleDeleteCar}
                        className="bg-red-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-red-600 transition"
                        style={{
                          backgroundColor: 'red',
                          color: 'white',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Normal shadow
                          transition: 'box-shadow 0.3s ease', // Smooth transition for hover effect
                        }}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)'} // Hover effect
                        onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
                      >
                        Delete Car
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
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
                <option value="" disabled>Select a Vehicle</option>
                {userVehicles.map((car, index) => (
                  <option key={car.id} value={car.id}>
                    {`${index + 1}: ${car.model} (${car.year})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              {Array.isArray(services) && services.length > 0 ? (
                <div>
                  <select onChange={handleLocationChange} value={selectedLocation} className="p-3 border mt-2 w-full rounded-md">
                    <option value="">Select Location</option>
                    {[...new Set(services.map(service => service.service_location))].map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>

                  {selectedLocation && (
                    <select className="p-3 border mt-2 w-full rounded-md" onChange={handleVehicleServiceDetailsChange} name="service_id">
                      <option value="">Select Service</option>
                      {filteredServices.map((service, index) => (
                        <option key={index} value={service.service_id}>
                          {`${service.user_name}: ${service.service_name} (KES ${service.service_cost})`}
                        </option>
                      ))}
                    </select>
                  )}
                  </div>
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
                  <p><strong>Garage Name:</strong> {request.garage_name}</p>
                  <p><strong>Garage Location:</strong> {request.garage_location}</p>
                  <p><strong>Garage Email:</strong> {request.garage_email}</p>
                  {request.review_comment ? (
                    <p><strong>Review:</strong> {request.review_comment}</p>
                  ): (
                    <>
                    <p>
                      <strong>Status: </strong>
                      {request.service_paid ? (
                        <>
                          Paid
                          <button
                            onClick={() => {handleOpenReviewModal(request)}}
                            className="bg-green-500 text-white py-1 ml-2 px-6 rounded-lg hover:bg-blue-600 transition"
                          >
                            Review
                          </button>
                        </>
                        ) : (
                          <>
                            Unpaid
                            <button
                              onClick={() => {handlePayment(request)}}
                              className="bg-green-500 text-white py-1 ml-2 px-6 rounded-lg hover:bg-blue-600 transition"
                            >
                              Pay
                            </button>
                          </>
                        )}
                      </p>
                    </>
                  )}
                  
                </li>
              ))}
            </ul>
                         
            {/* Review Garage Modal */}
            <Modal show={isReviewGarageOpen} onHide={handleCloseReviewModal}>
              <Modal.Header closeButton>
                <Modal.Title>Review Garage Service</Modal.Title>
              </Modal.Header>
              
              <Modal.Body>              
                <Form onSubmit={handleUpdateVehicle}>
                <Form.Group controlId="reviewComment">
                  <Form.Label>Enter Review</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Review"
                    name="comment"
                    value={userServiceReview['comment']}
                    onChange={handleServiceReviewInputChange}
                    required
                  />
                </Form.Group>
                
                  <div className="flex justify-between">  
                    <Button
                      className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
                      type="submit"
                      onClick={handleSendReview}
                    >
                      Submit Review
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
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
            { name: 'Cars', icon: <FaCar />, section: 'car' },
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
