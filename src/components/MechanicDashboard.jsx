import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaCreditCard, FaRegClock, FaBell, FaInbox, FaUserAlt, FaArrowLeft } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const MechanicDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('analytics');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [analytics, setAnalytics] = useState({
    waitingClients: 0,
    completedOrders: 0,
    totalPayments: 0,
    performanceData: [],
  });

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
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">Mechanic Dashboard</h2>
        <ul className="space-y-4">
          {['serviceRequests', 'paymentHistory', 'notifications', 'messages', 'analytics'].map((section) => (
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

        {/* Render based on active section */}
        {activeSection === 'analytics' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Analytics</h3>
            <div className="space-y-4 mb-6">
              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-semibold">{analytics.waitingClients}</span>
                  <span className="text-lg">Waiting Clients</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-semibold">{analytics.completedOrders}</span>
                  <span className="text-lg">Completed Orders</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-semibold">${analytics.totalPayments}</span>
                  <span className="text-lg">Total Payments</span>
                </div>
              </div>
            </div>

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

export default MechanicDashboard;
