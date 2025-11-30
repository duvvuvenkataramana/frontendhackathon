import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRegistrations } from '../contexts/RegistrationsContext'

const API_BASE_URL = 'http://localhost:5000/api'

// Mock data for demonstration
const activities = [
  { id: 1, name: 'Annual Music Festival', date: '2025-10-15', role: 'Participant', status: 'Completed' },
  { id: 2, name: 'Robotics Workshop', date: '2025-11-20', role: 'Team Leader', status: 'Upcoming' },
  { id: 3, name: 'Drama Club Performance', date: '2025-09-05', role: 'Actor', status: 'Completed' }
]

const upcomingEvents = [
  { id: 1, name: 'Winter Sports Meet', date: '2025-12-10', registration: 'Open' },
  { id: 2, name: 'Coding Competition', date: '2025-11-30', registration: 'Open' }
]

export default function StudentDashboard(){
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addRegistration, getRegistrationsByStudent } = useRegistrations()
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registrationForm, setRegistrationForm] = useState({
    studentName: user?.name || '',
    rollNumber: user?.rollNumber || '',
    department: user?.department || '',
    year: user?.year || '',
    contactNumber: '',
    email: user?.email || ''
  })

  useEffect(() => {
    fetchRegisteredEvents()
  }, [])

  // Update registration form when user data changes
  useEffect(() => {
    if (user) {
      setRegistrationForm({
        studentName: user.name || '',
        rollNumber: user.rollNumber || '',
        department: user.department || '',
        year: user.year || '',
        contactNumber: '',
        email: user.email || ''
      })
    }
  }, [user])

  const fetchRegisteredEvents = async () => {
    try {
      // For now, using mock data. Replace with actual API call when backend is ready
      setRegisteredEvents([])
      // const response = await fetch(`${API_BASE_URL}/registrations/student/ST2025001`)
      // const data = await response.json()
      // setRegisteredEvents(data)
    } catch (error) {
      console.error('Error fetching registered events:', error)
    }
  }

  const handleRegister = (event) => {
    setSelectedEvent(event)
    setShowRegistrationModal(true)
  }

  const handleUnregister = (eventId) => {
    setRegisteredEvents(registeredEvents.filter(event => event.eventId !== eventId))
    alert('Successfully unregistered from the event!')
  }

  const isEventRegistered = (eventId) => {
    return registeredEvents.some(event => event.eventId === eventId)
  }

  const submitRegistration = async () => {
    try {
      const registrationData = {
        ...registrationForm,
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        registrationDate: new Date().toISOString().split('T')[0]
      }

      // Add registration to global context
      addRegistration(registrationData)

      // Also add to local state for immediate UI update
      setRegisteredEvents([...registeredEvents, registrationData])

      alert(`Successfully registered for ${selectedEvent.name}!`)

      // const response = await fetch(`${API_BASE_URL}/registrations`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(registrationData),
      // })
      // if (response.ok) {
      //   fetchRegisteredEvents()
      //   alert(`Successfully registered for ${selectedEvent.name}!`)
      // }

      setShowRegistrationModal(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Failed to register for the event. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2"
          >
            <span>←</span> Back to Home
          </button>
        </div>

        {/* Student Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Student Information</h2>
          <div>
            <p className="text-gray-600">Department: {user?.department || 'Not available'}</p>
            <p className="text-gray-600">Year: {user?.year || 'Not available'}</p>
          </div>
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Activity History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map(activity => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4">{activity.name}</td>
                    <td className="px-6 py-4">{activity.date}</td>
                    <td className="px-6 py-4">{activity.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-4 border rounded">
                <h3 className="font-medium">{event.name}</h3>
                <p className="text-sm text-gray-600">Date: {event.date}</p>
                <div className="mt-2">
                  {isEventRegistered(event.id) ? (
                    <button
                      type="button"
                      onClick={() => handleUnregister(event.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRegister(event)}
                      className="px-3 py-1 bg-primary text-white rounded text-sm"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Registered Events</h2>
          {registeredEvents.length === 0 ? (
            <p className="text-gray-600">No registered events yet.</p>
          ) : (
            <div className="space-y-4">
              {registeredEvents.map((registration, index) => (
                <div key={index} className="p-4 border rounded">
                  <h3 className="font-medium">{registration.eventName}</h3>
                  <p className="text-sm text-gray-600">Registration Date: {registration.registrationDate}</p>
                  <div className="mt-2 grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p><strong>Contact:</strong> {registration.contactNumber || 'Not provided'}</p>
                      <p><strong>Email:</strong> {registration.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p><strong>Department:</strong> {registration.department}</p>
                      <p><strong>Year:</strong> {registration.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Registration Modal */}
        {showRegistrationModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Register for {selectedEvent.name}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student Name</label>
                  <input
                    type="text"
                    value={registrationForm.studentName}
                    onChange={(e) => setRegistrationForm({...registrationForm, studentName: e.target.value})}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={registrationForm.rollNumber}
                    onChange={(e) => setRegistrationForm({...registrationForm, rollNumber: e.target.value})}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={registrationForm.department}
                    onChange={(e) => setRegistrationForm({...registrationForm, department: e.target.value})}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="text"
                    value={registrationForm.year}
                    onChange={(e) => setRegistrationForm({...registrationForm, year: e.target.value})}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={registrationForm.contactNumber}
                    onChange={(e) => setRegistrationForm({...registrationForm, contactNumber: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={submitRegistration}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
