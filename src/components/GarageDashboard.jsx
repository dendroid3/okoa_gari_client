import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaCreditCard, FaRegClock, FaBell, FaInbox, FaUserAlt, FaArrowLeft } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from "react-bootstrap";  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import BASE_URL from '../UTILS';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const GarageDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('myServices');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [analytics, setAnalytics] = useState({
    waitingClients: 0,
    completedOrders: 0,
    totalPayments: 0,
    performanceData: [],
  });

  const [newServiceDetails, setNewServiceDetails] = useState({
    name: '',
    location: '',
    cost: null
  })

  
  const [serviceToBeEdited, setServiceToBeEdited] = useState({
    name: '',
    location: '',
    cost: null
  })

  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false)
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)

  const handleToogleEditServiceModal = (service) => {
    if(service){
      setServiceToBeEdited(service)
      setIsEditServiceModalOpen(true)
    } else {
      setIsEditServiceModalOpen(false)
    }
  }

  const [userServices, setUserServices] = useState([])
  const [userServiceRequests, setUserServiceRequests] = useState([])

  const fetchUserServiceRequests = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/service_user/my_requests`, {
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
        setUserServiceRequests(data)
        // alert('service added successfully')
        // getUserVehicles()
      }
      console.log(response)
    } catch (error) {
      // alert('Could not add service. Pleaase try again')
      console.log(error)
    }
  }

  const fetchUserServices = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/services/`, {
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
        setUserServices(data)
        // alert('service added successfully')
        // getUserVehicles()
      }
      console.log(response)
    } catch (error) {
      // alert('Could not add service. Pleaase try again')
      console.log(error)
    }
  }

  const handleNewServiveDetailsChange = (e) => {
    const { name, value } = e.target;
    setNewServiceDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddService = async (e) => {
    {
      e.preventDefault()

      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      try {
        const response = await fetch(`${BASE_URL}/services/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newServiceDetails),
        });

        if(response.ok){
          alert('service added successfully')
          fetchUserServices()
          setIsAddServiceModalOpen(false)
        }
        console.log(response)
      } catch (error) {
        alert('Could not add service. Pleaase try again')
        console.log(error)
      }
    }
  }
  
  const handleEditServiveDetailsChange = (e) => {
    const { name, value } = e.target;
    setServiceToBeEdited((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleEditService = async (e) => {
    {
      e.preventDefault()

      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/services/${serviceToBeEdited.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(serviceToBeEdited),
        });

        if(response.ok){
          alert('service edited successfully')
          setIsEditServiceModalOpen(false)
          fetchUserServices()
        }
        console.log(response)
      } catch (error) {
        alert('Could not edit service. Pleaase try again')
        console.log(error)
      }
    }
  }

  const handleDeleteService = async (e) => {
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
        const response = await fetch(`${BASE_URL}/services/${serviceToBeEdited.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(serviceToBeEdited),
        });

        if(response.ok){
          alert('service deleleted successfully')
          setIsEditServiceModalOpen(false)
          fetchUserServices()
        }
        console.log(response)
      } catch (error) {
        alert('Could not delete service. Pleaase try again')
        console.log(error)
      }
  }

  // Mock Service Requests
  const fetchServiceRequests = useCallback(async () => {
    setServiceRequests([
      { id: 1, serviceType: 'Towing', customerName: 'John Doe', status: 'Not Started', date: '2024-10-01' },
      { id: 2, serviceType: 'Mechanical', customerName: 'Jane Smith', status: 'In Progress', date: '2024-10-05' },
      { id: 3, serviceType: 'Towing', customerName: 'Mary Johnson', status: 'Finished', date: '2024-10-10' },
      { id: 4, serviceType: 'Repair', customerName: 'Alice Williams', status: 'Finished', date: '2024-10-12' },
      { id: 5, serviceType: 'Mechanical', customerName: 'Bob Brown', status: 'Not Started', date: '2024-10-13' },
    ]);
  }, []);

  // Mock Payment History
  const fetchPaymentHistory = useCallback(async () => {
    setPaymentHistory([
      { id: 1, customerName: 'John Doe', amount: 100, date: '2024-10-01', status: 'Paid' },
      { id: 2, customerName: 'Jane Smith', amount: 150, date: '2024-10-05', status: 'Paid' },
      { id: 3, customerName: 'Mary Johnson', amount: 100, date: '2024-10-10', status: 'Paid' },
      { id: 4, customerName: 'Alice Williams', amount: 200, date: '2024-10-12', status: 'Paid' },
      { id: 5, customerName: 'Bob Brown', amount: 120, date: '2024-10-13', status: 'Paid' },
    ]);
  }, []);

  // Mock Analytics Calculation
  const calculateAnalytics = useMemo(() => {
    const waitingClients = serviceRequests.filter((request) => request.status === 'Not Started').length;
    const completedOrders = serviceRequests.filter((request) => request.status === 'Finished').length;
    const totalPayments = paymentHistory.reduce((total, payment) => total + payment.amount, 0);

    const performanceData = serviceRequests.reduce((acc, request) => {
      const date = request.date.split('-').slice(1).join('-');
      if (!acc[date]) acc[date] = { completed: 0, pending: 0, payments: 0 };
      if (request.status === 'Finished') acc[date].completed += 1;
      if (request.status === 'Not Started') acc[date].pending += 1;
      const payment = paymentHistory.find((payment) => payment.customerName === request.customerName);
      if (payment) acc[date].payments += payment.amount;
      return acc;
    }, {});

    const labels = Object.keys(performanceData);
    const completedData = labels.map((date) => performanceData[date].completed);
    const pendingData = labels.map((date) => performanceData[date].pending);
    const paymentsData = labels.map((date) => performanceData[date].payments);

    return {
      waitingClients,
      completedOrders,
      totalPayments,
      performanceData: { labels, completedData, pendingData, paymentsData },
    };
  }, [serviceRequests, paymentHistory]);

  useEffect(() => {
    fetchServiceRequests();
    fetchPaymentHistory();
  }, [fetchServiceRequests, fetchPaymentHistory]);

  useEffect(() => {
    fetchUserServices()
    fetchUserServiceRequests()
  }, [])
  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      title: { display: true, text: 'Mechanic Performance', color: 'white' },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: (tooltipItems) => `Date: ${tooltipItems[0].label}`,
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
      legend: { display: true, position: 'top', labels: { color: 'white' } },
    },
    scales: {
      x: {
        type: 'category',
        labels: analytics.performanceData.labels,
        title: { display: true, text: 'Date', color: 'white' },
        ticks: { color: 'white' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count/Amount', color: 'white' },
        ticks: { color: 'white' },
      },
    },
  }), [analytics.performanceData.labels]);

  const chartData = useMemo(() => ({
    labels: analytics.performanceData.labels || [],
    datasets: [
      {
        type: 'bar',
        label: 'Completed Orders',
        data: analytics.performanceData.completedData || [],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.7)',
        fill: true,
      },
      {
        type: 'bar',
        label: 'Pending Orders',
        data: analytics.performanceData.pendingData || [],
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.7)',
        fill: true,
      },
      {
        type: 'line',
        label: 'Total Payments ($)',
        data: analytics.performanceData.paymentsData || [],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  }), [analytics.performanceData]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-800 text-white p-6 fixed md:relative md:h-full z-10 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">Garage Dashboard</h2>
        <ul className="space-y-4">
          {['myServices', 'serviceRequests'].map((section) => (
            <li key={section}>
              <button
                onClick={() => handleSectionClick(section)}
                className={`flex items-center space-x-4 py-3 text-left px-4 rounded hover:bg-gray-700 transition duration-300 ease-in-out ${activeSection === section ? 'bg-gray-700' : ''}`}
              >
                <span className="text-2xl">{section === 'serviceRequests' ? <FaRegClock /> : section === 'paymentHistory' ? <FaCreditCard /> : section === 'notifications' ? <FaBell /> : section === 'messages' ? <FaInbox /> : <FaUserAlt />}</span>
                <span className="text-lg font-medium">{section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-6 md:ml-1/4 overflow-auto md:pl-24">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-400 hover:text-white transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Landing
          </button>
        </div>

        {activeSection === 'myServices' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-white -900">Our Services</h3>
              <button
                onClick={setIsAddServiceModalOpen}
                className="bg-green-500 text-white py-2 px-6 ml-4 rounded-lg mt-0 hover:bg-green-600 transition"
              >
                Add Service
              </button>
            </div>
            <div>
              {userServices.length === 0 ? (
                <p>No Services added yet</p> // Message when array is empty
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 text-center">Service Name</th>
                      <th className="border p-3 text-center">Location</th>
                      <th className="border p-3 text-center">Cost</th>
                      <th className="border p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userServices.map((service, index) => (
                      <tr key={index}>
                        <td className="border p-3 text-center">{service.name}</td>
                        <td className="border p-3 text-center">{service.location}</td>
                        <td className="border p-3 text-center">{service.cost}</td>
                        <td className="border p-3 text-center">
                          <button
                            onClick={() => handleToogleEditServiceModal(service)} 
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

               {/* Add Service Modal */}
               <Modal show={isAddServiceModalOpen} onHide={() => setIsAddServiceModalOpen(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Service</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>              
                  <Form onSubmit={handleAddService}>
                  {['name', 'location', 'cost'].map((field) => (
                    <Form.Group controlId={`service${field}`}>
                      <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                      <Form.Control
                        type={(field == 'name' || field == 'location') ? "text" : "number"}
                        placeholder={`Enter Service ${field.charAt(0).toUpperCase()}${field.slice(1)}`}
                        name={field}
                        value={newServiceDetails[field]}
                        onChange={handleNewServiveDetailsChange}
                        required
                      />
                    </Form.Group>
                  ))}
                  
                    <Button
                      className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
                      type="submit"
                    >
                      Add Service
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>

               {/* Edit Service Modal */}
               <Modal show={isEditServiceModalOpen} onHide={() => setIsEditServiceModalOpen(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Service</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>              
                  <Form onSubmit={handleEditService}>
                    {['name', 'location', 'cost'].map((field) => (
                      <Form.Group controlId={`service${field}`}>
                        <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                        <Form.Control
                          type={(field == 'name' || field == 'location') ? "text" : "number"}
                          placeholder={`Enter Service ${field.charAt(0).toUpperCase()}${field.slice(1)}`}
                          name={field}
                          value={serviceToBeEdited[field]}
                          onChange={handleEditServiveDetailsChange}
                          required
                        />
                      </Form.Group>
                    ))}
                    <div className="flex justify-between">  
                      <Button
                        className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition"
                        type="submit"
                      >
                        Edit Service
                      </Button>
                      <Button
                        onClick={handleDeleteService}
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
                        Delete Service
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
          </div>
        )}
        {/* Render based on active section */}
        {activeSection === 'serviceRequests' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Service Requests</h3>
            <ul>
              {userServiceRequests.map((request, index) => (
                <li key={index} className="mt-4 p-4 border rounded-md">
                  <p><strong>Service:</strong> {request.service_name}</p>
                  <p><strong>Customer Name:</strong> {request.customer_name}</p>
                  <p><strong>Customer Email:</strong> {request.customer_email}</p>
                  <p><strong>Vehicle Model:</strong> {request.vehicle_model}</p>
                  <p><strong>Vehicle Registration:</strong> {request.vehicle_registration}</p>
                  <p><strong>Vehicle Year:</strong> {request.vehicle_year}</p>
                  <p><strong>Cost:</strong> {request.service_cost}</p>
                  <p><strong>Status:</strong> {request.service_paid? "Paid" : "Unpaid"}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Render based on active section */}
        {activeSection === 'analytics' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Services Requested</h3>
            

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Render other sections similarly */}
      </div>
    </div>
  );
};

export default GarageDashboard;
