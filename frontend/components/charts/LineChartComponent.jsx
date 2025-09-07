"use client"
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  {
    name: '15/02/2024',
    value: 4000
  },
  {
    name: '16/02/2024',
    value: 3000
  },
  {
    name: '17/02/2024',
    value: 2000
  },
];

export default function LineChartComponent() {

    const [data, setData] = useState(mockData)

    const [amount, setAmount] = useState("") 

    const handleAmount = (e) => {
      setAmount(e.target.value)
      setData(prev => [...prev, {name: '15/02/2024', value: e.target.value}])
    }

    return (
      <div className='w-full h-[36rem]'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}
