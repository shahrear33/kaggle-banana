import React, { useState } from 'react'
import MarkerComponentDetail from './MarkerComponentDetail';

export default function MarkerComponent({ detail }) {
  return (
    <div>
      {detail?.map((item) => {
            return (
                <MarkerComponentDetail key={item.id} item={item} />
            )   
        
      })}
    </div>
  )
}
