"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  UserService,
  UserInfo,
  UserDetail,
  UserRents,
  UserPayments,
} from "@/services/usersService";

function UserDetailsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [userInfo, setUserInfo] = useState<null | UserDetail>(null);
  const [isGeneralInfoOpen, setIsGeneralInfoOpen] = useState(false);
  const [isUserRentalsOpen, setIsUserRentalsOpen] = useState(false);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [userRentals, setUserRentals] = useState<null | UserRents[]>([]);
  const [userPayments, setUserPayments] = useState<null | UserPayments[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const response = await UserService.getUserDetail(Number(userId));
          setUserInfo(response);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    const fetchUserRentals = async () => {
      if (userId) {
        try {
          const rentals = await UserService.getUserRents(Number(userId));
          setUserRentals(rentals);
        } catch (error) {
          console.error("Error fetching user rentals:", error);
        }
      }
    };

    const fetchUserPayments = async () => {
      if (userId) {
        try {
          const payments = await UserService.getUserPayments(Number(userId));
          console.log(payments);
          setUserPayments(payments);
        } catch (error) {
          console.error("Error fetching user payments:", error);
        }
      }
    };

    fetchUserDetails();
    fetchUserRentals();
    fetchUserPayments();
  }, [userId]);

  if (!userInfo) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  const toggleGeneralInfo = () => setIsGeneralInfoOpen((prev) => !prev);
  const toggleUserRentals = () => setIsUserRentalsOpen((prev) => !prev);
  const togglePaymentDetails = () => setIsPaymentDetailsOpen((prev) => !prev);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const formatTotalPrice = (price: number) => {
    return price.toFixed(1);
  };

  return (
    <div className="ml-[276px]">
      <div className="p-6 bg-white shadow-md rounded-lg m-[12px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">User Details</h1>
        </div>

        <div className="overflow-x-auto">
          {/* General Information Section */}
          <div className="bg-gray-100 shadow-md rounded-lg p-3 space-y-4 mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleGeneralInfo}
            >
              <h2 className="text-2xl font-semibold mb-2">
                General Information
              </h2>
              <span>{isGeneralInfoOpen ? "▲" : "▼"}</span>
            </div>

            {isGeneralInfoOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-600">
                <div>
                  <strong>Full Name:</strong> {userInfo.fullname}
                </div>
                <div>
                  <strong>Email:</strong> {userInfo.email}
                </div>
                <div>
                  <strong>Phone:</strong> {userInfo.phone}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {userInfo.status ? "Active" : "Inactive"}
                </div>
                <div>
                  <strong>Licence Verified:</strong>{" "}
                  {userInfo.ısLicenceVerified ? "Yes" : "No"}
                </div>

                {/* License Information, only visible if Licence is verified */}
                {userInfo.ısLicenceVerified && (
                  <>
                    <div>
                      <strong>Licence No:</strong> {userInfo.licenceNo}
                    </div>
                    <div>
                      <strong>Valid Until:</strong>{" "}
                      {new Date(userInfo.validUntil).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Upload Date:</strong>{" "}
                      {new Date(userInfo.uploadDate).toLocaleDateString()}
                    </div>
                  </>
                )}

                {/* Balance Information */}
                <div>
                  <strong>Balance:</strong> {userInfo.balance ?? 0} TL
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-100 shadow-md rounded-lg p-3 space-y-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleUserRentals}
            >
              <h2 className="text-2xl font-semibold mb-2">User Rentals</h2>
              <span>{isUserRentalsOpen ? "▲" : "▼"}</span>
            </div>

            {isUserRentalsOpen && (
              <div className="overflow-x-auto">
                {userRentals && userRentals.length > 0 ? (
                  <table className="min-w-full border-collapse">
                    <thead className="border-b-2 border-gray-500">
                      <tr className="text-left">
                        <th className="px-4 py-2 text-gray-600">Rental ID</th>
                        <th className="px-4 py-2 text-gray-600">Car ID</th>
                        <th className="px-4 py-2 text-gray-600">Start Date</th>
                        <th className="px-4 py-2 text-gray-600">End Date</th>
                        <th className="px-4 py-2 text-gray-600">Total Price</th>
                        <th className="px-4 py-2 text-gray-600">Status</th>
                        <th className="px-4 py-2 text-gray-600">
                          Overdue Price
                        </th>
                        <th className="px-4 py-2 text-gray-600">
                          Overdue Date
                        </th>
                        <th className="px-4 py-2 text-gray-600">Rental Type</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRentals && userRentals.length > 0 ? (
                        userRentals.map((rental, index) => (
                          <tr
                            key={rental.rentalId}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">{rental.rentalId}</td>
                            <td className="px-4 py-3">{rental.carId}</td>
                            <td className="px-4 py-3">
                              {formatDate(rental.startDate)}
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(rental.endDate)}
                            </td>
                            <td className="px-4 py-3">
                              {formatTotalPrice(rental.totalPrice)} TL
                            </td>
                            <td className="px-4 py-3">{rental.rentalStatus}</td>
                            <td className="px-4 py-3">
                              {rental.overduePrice
                                ? `${rental.overduePrice} TL`
                                : "0 TL"}
                            </td>
                            <td className="px-4 py-3">
                              {rental.overdueDate
                                ? formatDate(rental.overdueDate)
                                : "-"}
                            </td>
                            <td className="px-4 py-3">{rental.rentalType}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={10}
                            className="text-center py-4 text-gray-500"
                          >
                            No Rentals Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div>No rentals found for this user.</div>
                )}
              </div>
            )}
          </div>

          {/* Payment Details Section */}
          <div className="bg-gray-100 shadow-md rounded-lg p-3 space-y-4 mt-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={togglePaymentDetails}
            >
              <h2 className="text-2xl font-semibold mb-2">User Payments</h2>
              <span>{isPaymentDetailsOpen ? "▲" : "▼"}</span>
            </div>
            {isPaymentDetailsOpen && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="border-b-2 border-gray-500">
                    <tr className="text-left">
                      <th className="px-4 py-2 text-gray-600">ID</th>
                      <th className="px-4 py-2 text-gray-600">Car ID</th>
                      <th className="px-4 py-2 text-gray-600">Rental ID</th>
                      <th className="px-4 py-2 text-gray-600">Price</th>
                      <th className="px-4 py-2 text-gray-600">Status</th>
                      <th className="px-4 py-2 text-gray-600">Time</th>
                      <th className="px-4 py-2 text-gray-600">
                        Balance Package Id
                      </th>
                      <th className="px-4 py-2 text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPayments && userPayments.length > 0 ? (
                      userPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">{payment.id}</td>
                          <td className="px-4 py-3">
                            {payment.balancePackageId === 1 ||
                            payment.balancePackageId === 2 ||
                            payment.balancePackageId === 3
                              ? "-"
                              : payment.carId}
                          </td>
                          <td className="px-4 py-3">
                            {payment.balancePackageId === 1 ||
                            payment.balancePackageId === 2 ||
                            payment.balancePackageId === 3
                              ? "-"
                              : payment.rentalId}
                          </td>
                          <td className="px-4 py-3">
                            {formatTotalPrice(payment.totalPrice)} TL
                          </td>
                          <td className="px-4 py-3">{payment.status}</td>
                          <td className="px-4 py-3">
                            {formatDate(payment.created)}
                          </td>
                          <td className="px-4 py-3">
                            {payment.balancePackageId
                              ? payment.balancePackageId
                              : "-"}
                          </td>
                          <td className="px-4 py-3">{payment.paymentType}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-4 text-gray-500"
                        >
                          No payment data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
