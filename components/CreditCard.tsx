"use client"
import { useUser } from "@/contexts/UserContext";
import React from 'react'
import { SiVisa, SiMastercard } from 'react-icons/si';


function CreditCard() {
    const { user } = useUser();


  return (
    <div>
          <SiVisa size={50} color="blue" />
          <img src="/mastercard.png" alt="Mastercard" width="60" />
   
  </div>
  )
}

export default CreditCard