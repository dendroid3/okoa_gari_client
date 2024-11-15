import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUserPlus, FaUserTimes, FaEdit, FaArrowLeft, FaUsers } from 'react-icons/fa'; // Added FaUsers
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuperAdmin = () => {
  const [selectedSection, setSelectedSection] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'admin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch admins data on component mount
  useEffect(() => {
    fetch('/api/get-admins')
      .then(response => response.json())
      .then(data => {
        setAdmins(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load admin data.');
        setLoading(false);
      });
  }, []);

  // Analytics Data for Chart.js
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Admins',
        data: [5, 6, 7, 8, 9, 10],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Payments Made',
        data: [500, 600, 700, 800, 900, 1000],
        borderColor: 'rgba(255, 159, 64, 1)',
        fill: false,
      }
    ],
  };

  // Sidebar Toggle
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toast Notification for Success/Failure
  const notify = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      notify('Name and Email are required.', 'error');
      return;
    }

    fetch('/api/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmin),
    })
      .then(response => response.json())
      .then(data => {
        setAdmins([...admins, data]);
        setNewAdmin({ name: '', email: '', role: 'admin' });
        notify('Admin created successfully!', 'success');
      })
      .catch(() => notify('Error creating admin.', 'error'));
  };

  const handleDeleteAdmin = (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    fetch(`/api/delete-admin/${adminId}`, { method: 'DELETE' })
      .then(() => {
        setAdmins(admins.filter(admin => admin.id !== adminId));
        notify('Admin deleted successfully!', 'success');
      })
      .catch(() => notify('Error deleting admin.', 'error'));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-gray-800 p-4 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex-none`}>
        <button onClick={toggleSidebar} className="text-white mb-6">
          <FaArrowLeft />
        </button>

        {/* Analytics Button */}
        <button onClick={() => setSelectedSection('analytics')} className="mb-4 text-white flex items-center">
          <FaChartLine className="mr-2" /> Analytics
        </button>

        {/* Manage Admins Button */}
        <button onClick={() => setSelectedSection('manageAdmins')} className="mb-4 text-white flex items-center">
          <FaUserPlus className="mr-2" /> Manage Admins
        </button>

        {/* View Admins Button */}
        <button onClick={() => setSelectedSection('viewAdmins')} className="mb-4 text-white flex items-center">
          <FaUsers className="mr-2" /> View Admins
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        <button onClick={() => (window.location.href = '/')} className="text-blue-500 hover:text-blue-700 transition mb-6">
          <FaArrowLeft /> Back to Landing Page
        </button>

        {/* Analytics Section */}
        {selectedSection === 'analytics' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Performance Overview</h3>
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <Line data={analyticsData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="text-lg font-semibold">Total Admins & Payments Made</h4>
              <div className="flex justify-between text-sm mt-4">
                <div>
                  <p><strong>Total Admins:</strong> {admins.length}</p>
                </div>
                <div>
                  <p><strong>Total Payments Made:</strong> $5000</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Admins Section */}
        {selectedSection === 'manageAdmins' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Manage Admins</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              admins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-4">
                  <div>
                    <h4>{admin.name}</h4>
                    <p>{admin.email}</p>
                    <p>{admin.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-500" onClick={() => alert('Edit functionality not implemented')}>
                      <FaEdit /> Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDeleteAdmin(admin.id)}>
                      <FaUserTimes /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Add Admin Form */}
            <div className="bg-gray-800 p-6 rounded-lg mt-6">
              <h4 className="text-xl mb-4">Create New Admin</h4>
              <input
                type="text"
                placeholder="Name"
                className="p-2 bg-gray-700 rounded mb-2 w-full"
                value={newAdmin.name}
                onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="p-2 bg-gray-700 rounded mb-2 w-full"
                value={newAdmin.email}
                onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
              <button className="bg-blue-500 p-2 w-full rounded" onClick={handleCreateAdmin}>
                <FaUserPlus className="mr-2" />
                Create Admin
              </button>
            </div>
          </div>
        )}

        {/* View Admins Section */}
        {selectedSection === 'viewAdmins' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">View All Admins</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              admins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-4">
                  <div>
                    <h4>{admin.name}</h4>
                    <p>{admin.email}</p>
                    <p>{admin.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-500" onClick={() => alert('Edit functionality not implemented')}>
                      <FaEdit /> Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDeleteAdmin(admin.id)}>
                      <FaUserTimes /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default SuperAdmin;
