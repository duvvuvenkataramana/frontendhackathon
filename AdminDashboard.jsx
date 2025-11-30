import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegistrations } from '../contexts/RegistrationsContext'

const API_BASE_URL = 'http://localhost:5000/api'

// Mock data for demonstration
const mockEvents = [
  { _id: '1', name: 'Annual Music Festival', date: '2025-10-15', description: 'A celebration of music and arts', participants: 150, status: 'Active' },
  { _id: '2', name: 'Robotics Workshop', date: '2025-11-20', description: 'Hands-on robotics training', participants: 50, status: 'Active' },
  { _id: '3', name: 'Drama Club Performance', date: '2025-09-05', description: 'Theater performance by drama club', participants: 80, status: 'Completed' }
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { registrations } = useRegistrations()
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    participants: ''
  })
  const [activeTab, setActiveTab] = useState('events')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      // For now, using mock data. Replace with actual API call when backend is ready
      setEvents(mockEvents)
      // const response = await fetch(`${API_BASE_URL}/events`)
      // const data = await response.json()
      // setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents(mockEvents) // Fallback to mock data
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingEvent) {
        // Update existing event
        const response = await fetch(`${API_BASE_URL}/events/${editingEvent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchEvents() // Refresh the events list
        }
      } else {
        // Create new event
        const response = await fetch(`${API_BASE_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchEvents() // Refresh the events list
        }
      }
      setShowModal(false)
      setEditingEvent(null)
      setFormData({ name: '', date: '', description: '', participants: '' })
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      date: event.date,
      description: event.description,
      participants: event.participants.toString()
    })
    setShowModal(true)
  }

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchEvents() // Refresh the events list
        }
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const openAddModal = () => {
    setEditingEvent(null)
    setFormData({ name: '', date: '', description: '', participants: '' })
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2"
            >
              <span>←</span> Back to Home
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2"
            >
              + Add Event
            </button>
          </div>
        </div>

        {/* Events Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Events Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map(event => (
                  <tr key={event._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4">{event.participants}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        event.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(event)}
                          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(event._id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Registrations */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Student Registrations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.length > 0 ? (
                  registrations.map((registration, index) => (
                    <tr key={registration.id || index}>
                      <td className="px-6 py-4">{registration.studentName}</td>
                      <td className="px-6 py-4">{registration.rollNumber}</td>
                      <td className="px-6 py-4">{registration.department}</td>
                      <td className="px-6 py-4">{registration.eventName}</td>
                      <td className="px-6 py-4">{registration.registrationDate}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm">{registration.contactNumber}</div>
                          <div className="text-sm text-gray-500">{registration.email}</div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No student registrations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Enter event description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Participants</label>
                  <input
                    type="number"
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter number of participants"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
