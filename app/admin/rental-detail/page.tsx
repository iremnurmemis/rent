"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CarRental, RentService } from "@/services/rentService";

function RentalDetailPage() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("rentalId");

  const [rental, setRental] = useState<CarRental | null>(null);
  const [isLoadingRental, setIsLoadingRental] = useState(false);
  const [rentalError, setRentalError] = useState("");

  useEffect(() => {
    if (!rentalId) return;

    const fetchRentalDetail = async () => {
      setIsLoadingRental(true);
      try {
        const data = await RentService.getRentalById(Number(rentalId));
        setRental(data);
      } catch (error) {
        setRentalError("Kiralama yüklenirken hata oluştu");
      } finally {
        setIsLoadingRental(false);
      }
    };

    fetchRentalDetail();
  }, [rentalId]);

  if (rentalError) {
    return <div className="text-red-500 font-semibold text-lg">{rentalError}</div>;
  }

  return (
    <div className="ml-[300px] mr-[32px] p-6 bg-white shadow-lg rounded-lg m-4 font-sans">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Rental Details</h1>

      {rental && (
        <div>
          <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg  text-gray-800">Rental ID: {rental.id}</h2>
            <p className="text-lg text-gray-800">Car ID: {rental.carId}</p>
            <p className="text-lg text-gray-800">User ID: {rental.userId}</p>
            <p className="text-lg text-gray-800">Rental Status: {rental.rentalStatus}</p>
            <p className="text-lg text-gray-800">Rental Type: {Number(rental.rentalType) === 1 ? "Daily" : "Hourly"}</p>
            <p className="text-lg text-gray-800 ">Price: {rental.totalPrice} ₺</p>
            <p className="text-lg text-gray-800">Start Date: {new Date(rental.startDate).toLocaleString()}</p>
            <p className="text-lg text-gray-800">End Date: {new Date(rental.endDate).toLocaleString()}</p>
            {rental.totalOverdueFee && rental.totalOverdueFee > 0 ? (
              <p className="text-lg text-gray-800 ">Overdue Fee: {rental.totalOverdueFee} ₺</p>
            ) : (
              <p className="text-lg text-gray-800">Aşım bilgisi oluşmamıştır </p>
            )}
            {rental.durationInDays && rental.durationInDays > 0 && (
              <p className="text-lg text-gray-800">Duration: {rental.durationInDays} days</p>
            )}
          </div>

          {rental.rentalImages && rental.rentalImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {rental.rentalImages.map((image, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105"
                >
                  <img
                    src={`http://localhost:5153/images/${image.imagePath}`}
                    alt={`Rental Image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-800 mt-4">Fotoğraf bilgisi yoktur</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RentalDetailPage;

