import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const clubs = [
  {id:1, name:'Music Club', desc:'Instruments, bands, and performances'},
  {id:2, name:'Robotics Club', desc:'Robots, coding and competitions'},
  {id:3, name:'Drama Club', desc:'Plays, improv and stagecraft'},
]

export default function ClubsSection(){
  return (
    <section id="clubs" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Clubs & Events</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {clubs.map(c=> (
            <motion.article key={c.id} whileHover={{scale:1.02}} className="p-6 bg-white rounded shadow">
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
              <div className="mt-4">
                <button className="px-3 py-1 bg-primary text-white rounded">View Events</button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
