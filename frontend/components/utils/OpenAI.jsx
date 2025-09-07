import { Axios } from 'axios'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { stringify } from 'postcss'

export default function OpenAI() {
    const url = 'https://api.openai.com/v1/chat/completions'
    const [data, setData] = useState(null)

    async function sendMessage(messageContent) {

    const response = await fetch(url, {
        method : "POST",
        headers : {
          Authorization : `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          'content-type' : 'application/json' 
        },
        body : JSON.stringify({
          model : "gpt-3.5-turbo",
          messages :  [
            {
              "role": "user",
              "content": "What is the capital of Uganda?"
            }
          ],
          max_tokens : 500
        })        
      })
      
      if (response.ok) {
        let answer = await response.json()
        setData(answer)
        console.log(answer)
      } else {
        console.error("Failed to send message");
      }
    }  

    
  return (
    <div>
        <button onClick={sendMessage}>Click Me</button>
        <div>
            {JSON.stringify(data)}
        </div>
    </div>
  )
}
