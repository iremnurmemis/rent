"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { CarDetail, CarService } from '@/services/carService';

function CarDetailPage() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");

  const [car, setCar] = useState<CarDetail | null>(null);
  const [isLoadingCar, setIsLoadingCar] = useState(false);
  const [carError, setCarError] = useState("");

  useEffect(() => {
    if (!carId) return;

    const fetchCarDetails = async () => {
      setIsLoadingCar(true);
      try {
        const data = await CarService.getCar(Number(carId));
        setCar(data);
      } catch (error) {
        setCarError("Araç yüklenirken hata oluştu");
      } finally {
        setIsLoadingCar(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  return (
    <div className="max-w-screen-xl mx-auto p-8 ml-[300px]">
      {isLoadingCar && <p className="text-center text-lg text-gray-600">Loading...</p>}
      {carError && <p className="text-center text-lg text-red-500">{carError}</p>}
      {car && (
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div>
            <h1 className="text-xl font-semibold  text-black-600 mb-4">{car.brandName} {car.modelName}</h1>
            <p className="text-xl text-black-600 mt-2">Category: {car.categoryName}</p>
            <p className="text-xl text-black-600 mt-2">Year: {car.year}</p>
            <p className="text-lg text-black-600 mt-2">Plate: <span className="">{car.plate}</span></p>
            <p className="text-lg text-black-600 mt-2">Fuel: <span className="">{car.fuelType}</span> </p>
            <p className="text-lg text-black-600 mt-2">Transmission: <span className="">{car.transmission}</span> </p>
            <p className="text-lg text-black-600 mt-2">Price per hour: <span>{car.pricePerHour}₺</span></p>
            <p className="text-lg text-black-600 mt-2">Price per day: <span>{car.pricePerDay}₺</span></p>
            <p className="text-lg text-black-600 mt-2">Seats: <span>{car.seatCount}</span></p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Car Images</h2>
            {car.carImages.length === 0 ? (
              <p className="text-lg text-black-600 mt-4">Resim bilgisi yoktur.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {car.carImages.map((image, index) => (
                  <div key={image.id} className="relative overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                    <img
                      src={`http://localhost:5153/images/${image.imageUrl}`}
                      alt={`Car Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-xl shadow-md hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

         <div>
            <h2 className="text-2xl font-semibold text-gray-900">Main Image</h2>
            {car.mainImage ? (
              <div className="relative overflow-hidden rounded-lg shadow-md mt-6">
                <img
                  src={`http://localhost:5153/images/${car.mainImage}`}
                  alt="Main Car Image"
                  className="w-80 h-56 object-cover rounded-xl shadow-md"
                />
              </div>
            ) : (
              <p className="text-lg text-black-600 mt-4">Ana resim bilgisi yoktur.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetailPage;
