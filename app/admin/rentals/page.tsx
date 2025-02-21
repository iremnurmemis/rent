"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { AdminCarRental, RentService } from "@/services/rentService";
import { useRouter } from "next/navigation";

function RentalsPage() {
  const [rentals, setRentals] = useState<AdminCarRental[]>([]);
  const router = useRouter();

  const handleFilterClick = () => {
    console.log("Filtering payments...");
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await RentService.getAllRentals();
        console.log(response);
  
        // Tarihe göre eski tarihten yeniye sıralama
        const sortedRentals = response.sort(
          (a: AdminCarRental, b: AdminCarRental) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
  
        setRentals(sortedRentals);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
  
    fetchRentals();
  }, []);
  

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  function mapRentalStatus(status: number): string {
    switch (status) {
      case 0:
        return "Active";
      case 1:
        return "Completed";
      case 2:
        return "Pending";
      case 3:
        return "Failed";
      default:
        return "Unknown";
    }
  }

  const handleDetail = (rentalId: number) => {
    router.push(`/admin/rental-detail?rentalId=${rentalId}`);
  };

  return (
    <div className="ml-[288px] p-6 bg-white shadow-lg rounded-lg">
      {/* Üst başlık */}
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold text-gray-800">Car Rentals</h1>
        <button
          className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition"
          onClick={handleFilterClick}
        >
          <span className="mr-2">Filter</span>
          <FontAwesomeIcon icon={faFilter} className="text-lg" />
        </button>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border-collapse">
          <thead className="border-b-2 border-gray-500">
            <tr className="text-left">
              <th className="px-6 py-3">Id</th>
              <th className="px-6 py-3">Car Id</th>
              <th className="px-6 py-3">User Id</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">End Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Rental Type</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental, index) => (
              <tr
                key={rental.id}
                className={`border-b border-gray-300 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition`}
              >
                <td className="px-6 py-3">{rental.id}</td>
                <td className="px-6 py-3">{rental.carId}</td>
                <td className="px-6 py-3">{rental.userId}</td>
                <td className="px-6 py-3 font-semibold">
  {rental.totalPrice?.toFixed(2) ?? "0.00"} ₺
</td>

                <td className="px-6 py-3">{formatDate(rental.startDate)}</td>
                <td className="px-6 py-3">{formatDate(rental.endDate)}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      rental.rentalStatus === 0
                        ? "bg-green-100 text-green-800"
                        : rental.rentalStatus === 1
                        ? "bg-gray-100 text-gray-800"
                        : rental.rentalStatus === 2
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mapRentalStatus(rental.rentalStatus)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {rental.rentalType == "1" ? "Daily" : "Hourly"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                    onClick={() => handleDetail(rental.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RentalsPage;
