import { useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setDashTab } from '../store/slices/dashtabSlice'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const AllReviews = () => {
  const [reviews, setRevCom] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const fetchAllRevCom = async () => {
    setLoading(true)
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setRevCom(data)
    } else {
      console.log('Error Fetching data')
    }
  }
  useEffect(() => {
    fetchAllRevCom()
  }, [])

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`/reviews/${id}`, {
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
              <h1 className="my-2 text-2xl ml-2">All Reviews</h1>
              
            </div>
            {reviews && reviews.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">id</th>
                    <th className="py-3 px-6 text-left">Review</th>
                    <th className="py-3 px-6 text-left">service_id</th>
                    <th className="py-3 px-6 text-left">user_id</th>
                    <th className="py-3 px-6 text-left">review_type</th>
                    <th className="py-3 px-6 text-left">created-at</th>
                    <th className="py-3 px-6 text-left">updated-at</th>
                  </tr>
                </thead>
                <tbody className="text-black font-light">
                  {reviews.map((review) => (
                    <tr
                      key={review.review_id}
                      className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        navigate(`/review/${review.review}`)
                      }
                    >
                      <td className="py-3 px-6 text-left">
                        {review?.id}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {review?.review}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {review?.service_id}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {review?.user_id}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {review?.review_type}
                        </td>
                      <td className="py-3 px-6 text-left">
                        {review?.created_at}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {review?.updated_at}
                      </td>
                                       
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
                            deleteUser(review.id)
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
              <p className="text-center text-gray-500">No reviews found.</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default AllReviews