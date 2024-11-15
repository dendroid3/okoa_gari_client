import { useState, useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setDashTab } from '../store/slices/dashtabSlice'
import Cookies from 'js-cookie'

const NewGarage = () => {
  const [user, setUser] = useState([])
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    department_id: '',
    role_id: '',
  })
  const dispatch = useAppDispatch()

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchRolesAndDepartments = async () => {
      try {
        const [rolesResponse, departmentsResponse] = await Promise.all([
          fetch('/api/roles'),
          fetch('/api/departments'),
        ])

        const rolesData = await rolesResponse.json()
        const departmentsData = await departmentsResponse.json()

        setRoles(rolesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error('Error fetching roles or departments:', error)
        setErrors('Failed to load roles or departments.')
      }
    }

    fetchRolesAndDepartments()
  }, [])

  const validateForm = () => {
    let formErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/

    if (!formData.first_name.trim()) {
      formErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      formErrors.last_name = 'Last name is required'
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      formErrors.email = 'Valid email is required'
    }

    if (
      !formData.phone_number.trim() ||
      !phoneRegex.test(formData.phone_number)
    ) {
      formErrors.phone_number = 'Valid phone number (10 digits) is required'
    }

    if (!formData.department_id) {
      formErrors.department_id = 'Department is required'
    }

    if (!formData.role_id) {
      formErrors.role_id = 'Role is required'
    }

    setErrors(formErrors)

    return Object.keys(formErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + Cookies.get('access_token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Error submitting form')
        }

        const data = await response.json()
        console.log('Employee added successfully:', data)

        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          department_id: '',
          role_id: '',
        })
        setErrors({})
        dispatch(setDashTab('employees'))
      } catch (error) {
        alert('Tokex has Expired')
        console.error('Error adding employee:', error)
      }
    }
  }

  return (
    <div className="max-w-md w-full mx-auto mt-10 bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add New Employee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="first_name"
          >
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="last_name"
          >
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="phone_number"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.phone_number ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
          )}
        </div>

        <div className="flex items-start flex-col justify-start w-full">
          <label htmlFor="department" className="text-sm text-gray-700">
            Department
          </label>
          <select
            id="department"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-start flex-col justify-start w-full">
          <label htmlFor="role" className="text-sm text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewEmployee