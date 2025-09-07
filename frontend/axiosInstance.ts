import axios from 'axios'


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '69420'
    }
})

export default api;