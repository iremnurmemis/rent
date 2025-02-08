"use client"
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { PaymentDetail, PaymentService } from '@/services/paymentsService';

function PaymentDetailPage() {
  const [payments, setPayments] = useState<PaymentDetail[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await PaymentService.getAllPayments();
        setPayments(response);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handleFilterClick = () => {
    console.log('Filtering payments...');
  };

  return (
    <div className='ml-[276px] p-2'>
      <div className='p-4 bg-white shadow-lg rounded-xl m-[12px]'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Payment Details</h1>
          <button
            className='flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all'
            onClick={handleFilterClick}
          >
            <span className='mr-2'>Filter</span>
            <FontAwesomeIcon icon={faFilter} className='text-lg' />
          </button>
        </div>
        <div className='overflow-x-auto rounded-lg shadow-md'>
          <table className='min-w-full border-collapse bg-gray-50 rounded-lg'>
            <thead className='bg-gray-200 text-gray-700'>
              <tr className='text-left'>
                <th className='px-6 py-3'>Id</th>
                <th className='px-6 py-3'>User Id</th>
                <th className='px-6 py-3'>Card No</th>
                <th className='px-6 py-3'>Price</th>
                <th className='px-6 py-3'>Time</th>
                <th className='px-6 py-3'>Type</th>
                <th className='px-6 py-3'>Status</th>
                <th className='px-6 py-3'>Rental Id</th>
                <th className='px-6 py-3'>Balance Id</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr key={payment.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-200 transition-all`}> 
                    <td className='px-6 py-3'>{payment.id}</td>
                    <td className='px-8 py-3 '>{payment.userId}</td>
                    <td className='px-2 py-3'>**** **** **** {payment.cardNumber.slice(-4)}</td>
                    <td className='px-4 py-3 font-semibold'>{payment.totalPrice.toFixed(2)} ₺</td>
                    <td className='px-4 py-3'>{new Date(payment.created).toLocaleString()}</td>
                    <td className='px-6 py-3'>{payment.paymentType}</td>
                    <td className='px-6 py-3'>
                      <span className={`px-3 py-1 text-sm rounded-full ${payment.status === 'Success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{payment.status}</span>
                    </td>
                    <td className='px-12 py-3'>{payment.rentalId ?? '-'}</td>
                    <td className='px-12 py-3'>{payment.balancePackageId ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className='text-center py-6 text-gray-500'>No payment records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailPage;
