"use client";
import React, { useState, useEffect } from "react";
import { CarLocation,CarDetail } from "@/services/carLocationService";
import { FaGasPump } from "react-icons/fa";
import { MdAirlineSeatLegroomNormal } from "react-icons/md";
import { PiSteeringWheelFill } from "react-icons/pi";
import Image from "next/image";

interface CarListProps {
  userLocation: [number, number];
  cars: CarLocation[];
  carDetails: CarDetail[];
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const CarList = ({ userLocation, cars, carDetails }: CarListProps) => {
  const [sortedCars, setSortedCars] = useState<any[]>([]);

  useEffect(() => {
    // Araçları mesafeye göre sıralamak için önce birleştirelim
    const carsWithDistance = cars
      .map((car) => {
        const details = carDetails.find(
          (detail) => detail.carId === car.carId
        );
        const distance = details
          ? calculateDistance(
              userLocation[1],
              userLocation[0],
              car.latitude,
              car.longitude
            )
          : 0;
        return details
          ? {
              ...car,
              ...details,
              distance,
            }
          : null;
      })
      .filter((car) => car !== null);

    // Mesafeye göre sıralama
    carsWithDistance.sort((a, b) => a.distance - b.distance);

    setSortedCars(carsWithDistance);

    console.log("Cars:", cars);
console.log("Car Details:", carDetails);
console.log("Cars With Distance:", carsWithDistance);

  }, [userLocation, cars, carDetails]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start",
        gap: "5px", // Reduced spacing between rows and columns
        marginTop: "10px", // Reduced spacing from the map
        height: "auto",
        marginLeft:"30px",
        marginRight:"30px"
      }}
    >
      {sortedCars.map((car, index) => (
        <div key={index} style={cardStyle}>
          <div>
            <div className="flex justify-between">
              <h2 className="text-[20px] font-medium mb-2 text-gray-700">
                {car.brandName} {car.modelName}
              </h2>
              <h2 className="text-[20px] font-medium mb-2  text-gray-700">
                {car.categoryName}
              </h2>
            </div>
            <div className="flex justify-between">
              <h2 className="text-[28px] font-bold mb-2  text-gray-700">
                <span className="text-[12px] font-light ">$</span>
                {car.pricePerHour}
                <span className="text-[12px] font-light  text-gray-700">
                  {" "}
                  /day
                </span>
              </h2>
              <h2 className="mt-[10px] text-[15px] font-bold mb-2  text-gray-700">
                {car.distance.toFixed(2)} km
              </h2>
            </div>
            <Image
              src="/dene.webp" // Resmin yolu
              alt="Car"
              width={500} // Genişlik
              height={300}
              style={{}} // Yükseklik
            />

            <div className="flex justify-around mt-[20px] ">
              <div className="text-center text-gray-700">
                <PiSteeringWheelFill className="w-full text-[22px] mb-2" />
                <h2 className="line-clamp-5 text-[14px] font-light">
                  {car.transmission}
                </h2>
              </div>
              <div className="text-center text-gray-700">
                <MdAirlineSeatLegroomNormal className="w-full text-[22px] mb-2" />
                <h2 className="line-clamp-5 text-[14px] font-light">
                  {car.seatCount}X
                </h2>
              </div>
              <div className="text-center text-gray-700">
                <FaGasPump className="w-full text-[22px] mb-2" />
                <h2 className="line-clamp-5 text-[14px] font-light">
                  {120} MPG
                </h2>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const cardStyle = {
  background: "#f4f4f4",
  borderRadius: "8px",
  padding: "16px",
  margin: " 10px 0px",
  height:"330px",
  width:"300px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

export default CarList;
