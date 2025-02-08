"use client";
import React, { useState, useEffect } from "react";
import { UserInfo, UserService } from "@/services/usersService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";


function Drivers() {
   const router = useRouter();
  const [drivers, setDrivers] = useState<UserInfo[] | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsersInfo();
        setDrivers(response);
      } catch (error) {
        console.error("Error fetching users info:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterClick = () => {
    console.log("Filter button clicked!");
  };

  const handleDetailsClick = (userId: number) => {
    router.push(`/admin/user-details?userId=${userId}`);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg m-[12px]">
      <div className="flex justify-between items-center  p-4">
        <h1 className="text-2xl font-bold text-gray-800">Drivers</h1>

        <button className="flex items-center text-gray-900 hover:text-gray-700 font-medium mr-12"  onClick={handleFilterClick}>

          <span className="mr-2">Filter</span>
          <FontAwesomeIcon icon={faFilter} className="text-lg" />
        </button>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="min-w-full border-collapse">
          <thead className="border-b-2 border-gray-500">
            <tr className=" text-left">
              <th className="px-4 py-2 text-gray-600">No.</th>
              <th className="px-4 py-2 text-gray-600">Full Name</th>
              <th className="px-4 py-2 text-gray-600">Email</th>
              <th className="px-4 py-2 text-gray-600">Phone</th>
              <th className="px-4 py-2 text-gray-600">Status</th>
              <th className="px-4 py-2 text-gray-600">License Verified</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {drivers ? (
              drivers.map((driver, index) => (
                <tr key={driver.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    {driver.firstName} {driver.lastName}
                  </td>
                  <td className="px-4 py-3">{driver.email}</td>
                  <td className="px-4 py-3">{driver.phoneNumber}</td>
                  <td className="px-4 py-3 flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(
                        driver.status
                      )}`}
                    ></span>
                    {driver.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-2 transform translate-y-[-2.8px] translate-x-[36.8px]">
                    {driver.isDrivingLicenseVerified ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-3">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded-md" 
                      onClick={() => handleDetailsClick(driver.id)}  
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Loading drivers...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Durum renklerini belirleme fonksiyonu
const getStatusColor = (status: boolean) => {
  return status ? "bg-green-500" : "bg-red-500";
};

export default Drivers;
