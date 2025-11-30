import React from 'react'

const images = Array.from({length:6}).map((_,i)=>`https://picsum.photos/seed/${i}/600/400`)

export default function GallerySection(){
  return (
    <section id="gallery" className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Gallery</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src,idx)=> (

            
            <img key={idx} src={src} alt={`event-${idx}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      </div>
    </section>
  )
}
