import React, { useState } from 'react'
import HeroSection from '../components/HeroSection'
import ClubsSection from '../components/ClubsSection'
import GallerySection from '../components/GallerySection'
import NoticesSection from '../components/NoticesSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

export default function LandingPage(){
  const [rollNumber, setRollNumber] = useState('')

  const checkParticipation = () => {
    alert('Check participation for roll number: ' + rollNumber)
  }

  return (
    <div className="pt-16">
      <HeroSection />
      <ClubsSection />
      <GallerySection />
      <NoticesSection />
      <ContactSection />
      <section id="participation" className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Check Participation</h2>
          <div className="flex gap-2">
            <input
              placeholder="Enter roll number"
              className="w-full border rounded px-3 py-2"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
            <button onClick={checkParticipation} className="px-4 py-2 bg-primary text-white rounded">Check</button>
          </div>
          <p className="mt-3 text-sm text-gray-600">This is a placeholder — connect with backend to fetch real participation data.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
