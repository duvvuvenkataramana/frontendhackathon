import React, { createContext, useContext, useState, useEffect } from 'react'

const RegistrationsContext = createContext()

export const useRegistrations = () => {
  const context = useContext(RegistrationsContext)
  if (!context) {
    throw new Error('useRegistrations must be used within a RegistrationsProvider')
  }
  return context
}

export const RegistrationsProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState([])

  // Load registrations from localStorage on mount
  useEffect(() => {
    const savedRegistrations = localStorage.getItem('studentRegistrations')
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations))
    }
  }, [])

  // Save registrations to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studentRegistrations', JSON.stringify(registrations))
  }, [registrations])

  const addRegistration = (registrationData) => {
    const newRegistration = {
      id: Date.now().toString(),
      ...registrationData,
      registrationDate: new Date().toISOString().split('T')[0]
    }
    setRegistrations(prev => [...prev, newRegistration])
    return newRegistration
  }

  const getRegistrations = () => {
    return registrations
  }

  const getRegistrationsByStudent = (rollNumber) => {
    return registrations.filter(reg => reg.rollNumber === rollNumber)
  }

  const removeRegistration = (registrationId) => {
    setRegistrations(prev => prev.filter(reg => reg.id !== registrationId))
  }

  const value = {
    registrations,
    addRegistration,
    getRegistrations,
    getRegistrationsByStudent,
    removeRegistration
  }

  return (
    <RegistrationsContext.Provider value={value}>
      {children}
    </RegistrationsContext.Provider>
  )
}
