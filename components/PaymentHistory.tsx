"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Payment, PaymentService, mapRentalStatus } from "@/services/paymentsService";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

function PaymentHistory() {
  const { user } = useUser();
  const [payments, setPayments] = useState<null | Payment[]>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await PaymentService.getUserPayments(user.id);
        if (response) {
          const mappedPayments = response
            .map((payment) => ({
              ...payment,
              status: mapRentalStatus(parseInt(payment.status)),
            }))
            .sort(
              (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
            );
          setPayments(mappedPayments);
        } else {
          setPayments(null);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    if (user?.id) {
      fetchPayments();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${day}/${month}/${year} ${hours}:${minutes}`; // GG/AA/YYYY SS:DD formatında
  };
  

  const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case "Failed":
        return <FaTimesCircle className="text-red-500 text-xl" />;
      default:
        return <FaClock className="text-gray-500 text-xl" />;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b ">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Ödeme Geçmişi
      </h1>
      {payments ? (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">Kiralama No</th>
                <th className="py-4 px-6 text-left font-semibold">Araç</th>
                <th className="py-4 px-6 text-left font-semibold">Plaka</th>
                <th className="py-4 px-6 text-left font-semibold">Ücret</th>
                <th className="py-4 px-6 text-left font-semibold">Kart Numarası</th>
                <th className="py-4 px-6 text-left font-semibold">Durum</th>
                <th className="py-4 px-6 text-left font-semibold">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-indigo-100 transition duration-200`}
                >
                  <td className="py-4 px-6 font-medium text-indigo-600">
                    #{payment.rentalId}
                  </td>
                  <td className="py-4 px-6">{payment.brand} {payment.model}</td>
                  <td className="py-4 px-6">{payment.plate}</td>
                  <td className="py-4 px-6  font-bold">
                    {payment.rentalAmount} TL
                  </td>
                  <td className="py-4 px-6">{maskCardNumber(payment.cardNumber)}</td>
                  <td className="py-4 px-6 flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span className="font-semibold">
                      {payment.status === "Success"
                        ? "Başarılı"
                        : payment.status === "Failed"
                        ? "Başarısız"
                        : "Bekliyor"}
                    </span>
                  </td>
                  <td className="py-4 px-6">{formatDate(payment.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Ödeme geçmişiniz bulunmamaktadır.
        </p>
      )}
    </div>
  );
}

export default PaymentHistory;
