"use client"
import React, { useState } from 'react'

export default function PaymentComponent({ billed, setBilled, paymentMethod, setPaymentMethod, amount, setAmount }) {
    
    const [cardNumber, setCardNumber] = useState("")    
    const [cardName, setCardName] = useState("")
    const [cardExpire, setCardExpire] = useState("")
    const [cardCVC, setCardCVC] = useState("")
    
    
  return (
    <div className='w-[65%] h-screen flex flex-col items-center p-8 bg-slate-700'>
      <div>
        <h1 className='text-4xl my-2'>Please Complete Your Payment At First</h1>
        <p className='my-1'>No Commitments. Cancel Anytime</p>
        <p className='my-4 font-bold text-lg'>Select a plan :</p>
      </div>
      <div className='flex space-x-24'>
            <div className={`p-8 rounded-lg border space-y-3 ${billed == 'Monthly' ? 'border-blue-500' : 'border-gray-300'}`}>
                <div className='flex space-x-4 items-center'>
                    <input type="radio" name="plan" id="plan1" onChange={e => setBilled("Monthly")} />
                    <label htmlFor="plan1" className='font-semibold text-md'>Monthly</label>
                </div>
                <p>BDT. {amount} / month</p>
            </div>
            <div className={`p-8 rounded-lg border  space-y-1 ${billed == 'Yearly' ? 'border-blue-500' : 'border-gray-300'}`}>
                <div className='flex space-x-4 items-center'>
                    <input type="radio" name="plan" id="plan2" onChange={e => setBilled("Yearly")} />
                    <label htmlFor="plan2" className='font-semibold text-md'>Yearly</label>
                </div>
                <p>BDT. {amount} / month</p>
                <p className='text-sm text-gray-500'>(BDT. {amount * 12} billed annually)</p>
            </div>
      </div> 
        {/* Payment Method Selection */}
      <p className='my-8 font-semibold mr-auto ml-[27%] '>Select a payment method :</p>
      <div>
            <div className={`p-8 my-5 flex w-48 w rounded-lg border space-x-3 ${paymentMethod == 'bkash' ? 'border-blue-500' : 'border-gray-300'}`}>
                <div className='flex space-x-4 items-center'>
                    <input type="radio" name="payment" id="bkash" onChange={e => setPaymentMethod("bkash")} />
                    <label htmlFor="bkash" className='font-semibold text-md'>Bkash</label>
                </div>
                <img src='/bkash.png' width={24} height={24}/>
            </div>
            <span>------------------------------------------------or-------------------------------------------------</span>
            <div className={`p-8 my-5 flex w-96 rounded-lg border space-x-3 ${paymentMethod == 'card' ? 'border-blue-500' : 'border-gray-300'}`}>
                <div className='flex space-x-4 items-center'>
                    <input type="radio" name="payment" id="card" onChange={e => setPaymentMethod("card")} />
                    <label htmlFor="card" className='font-semibold text-md'>Other Payment Options</label>
                </div>
                <img src='/credit_card.png' width={24} height={24}/>
            </div>
      </div>
      {
        // Credit Card Selected 
        paymentMethod == 'card' &&
        <div className='flex flex-col space-y-4 mr-auto ml-[27%] '>
            <div className='flex flex-col'>
                <label htmlFor="cardNumber" className='font-semibold text-lg space-y-2 mb-2'>Card Number</label>
                <input className='border bg-white border-gray-300 rounded-md px-4 py-2  ' type="text" name="cardNumber" id="cardNumber" placeholder='1234 1234 1234 1234' onChange={e => setCardNumber(e.target.value)}/>
            </div>
            <div className='flex space-x-4'>
                <div className='flex flex-col'>
                    <label htmlFor="cardExpire" className='font-semibold text-lg space-y-2 mb-2'>Expiration</label>
                    <input className='border bg-white border-gray-300 rounded-md px-4 py-2  ' type="text" name="cardExpire" id="cardExpire" placeholder='MM/YY' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="cardCVC" className='font-semibold text-lg space-y-2 mb-2'>CVC</label>
                    <input className='border bg-white border-gray-300 rounded-md px-4 py-2  ' type ="text" name="cardCVC" id="cardCVC" placeholder='910' />
                </div>
                
            </div>
            {/* Select Country */}
            <div className='flex flex-col'>
                <label htmlFor="country" className='font-semibold text-lg space-y-2 mb-2'>Country</label>
                <select className='border border-gray-300 rounded-md px-4 py-2   bg-white' name="country" id="country">
                    <option className='bg-white' value="Bangladesh">Bangladesh</option>
                </select>
            </div>
        </div>
      }
      {/* Discount */}
      <div className='flex items-center space-x-3 mr-auto ml-[27%] my-8 mb-16'>
        <p className='my-8 font-semibold '>Gift Card or Discount Code :</p>
        <div className='flex space-x-4'>
            <input className='border bg-white border-gray-300 rounded-md px-4 py-2  ' type="text" name="discount" id="discount" placeholder='Enter your code' />
            <button className='px-4 py-2 bg-[#199292] text-white rounded-md'>Apply</button>
        </div>
      </div>
    </div>
  )
}
