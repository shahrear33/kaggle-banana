import React from 'react'

export default function VideoPlayer({ src, poster, width, height }) {
  return (
    <div className="rounded-lg w-full h-screen flex items-center justify-center">
        <video 
            src = {src} 
            width = {width} 
            height = {height}
            poster = {poster}
            controls
            className='rounded-lg'
        />
    </div>
  )
}
