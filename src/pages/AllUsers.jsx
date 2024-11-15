import { useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setDashTab } from '../store/slices/dashtabSlice'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const AllUsers = () => {
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const fetchAllUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/users')
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setUsers(data)
    } else {
      console.log('Error Fetching data')
    }
  }
  useEffect(() => {
    fetchAllUsers()
  }, [])

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + Cookies.get('access_token'),
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
      })
      const result = await response.text()
      console.log(result)
      fetchAllUsers()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className="mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            {/* Loading animation */}
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <h1 className="my-2 text-2xl ml-2">All Users</h1>
              <button
                onClick={() => dispatch(setDashTab('newuser'))}
                className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                New User
              </button>
            </div>
            {users && users.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">User ID</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">created_at</th>
                    <th className="py-3 px-6 text-left">updated_at</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black font-light">
                  {users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        navigate(`/user/${user.user_id}`)
                      }
                    >
                      <td className="py-3 px-6 text-left">
                        {user?.id}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {user?.email}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {user?.created_at}
                      </td>
                      <td className="py-3 px-6 text-left">{user?.updated_at || 'N/A'}</td>
                                       
                      <td
                        className="py-3 px-6 text-left"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <button
                          className="text-sm p-2 bg-red-600 rounded-md text-white font-bold"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteUser(user.user_id)
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No users found.</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default AllUsers