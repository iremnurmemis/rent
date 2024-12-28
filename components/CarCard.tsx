import React from 'react'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import { FaCarSide, FaCircleUser } from "react-icons/fa6";
import { FaWalking } from "react-icons/fa";
import { PiSteeringWheelFill } from "react-icons/pi";
import { MdAirlineSeatLegroomNormal } from "react-icons/md";
import { FaGasPump } from "react-icons/fa";
import Image from "next/image";
import { CarDetail, CarLocation } from "../services/carLocationService";


const CarCard: React.FC<{ car: CarLocation }> = ({ car }) => {
  return (
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex justify-between">
            <h2 className="text-[20px] font-medium mb-2 text-gray-700">
              {car.brand} {car.model}
            </h2>
            <h2 className="text-[20px] font-medium mb-2  text-gray-700">
              {car.category}
            </h2>
          </div>
          <div className="flex justify-between">
            <h2 className="text-[28px] font-bold mb-2  text-gray-700">
              <span className="text-[12px] font-light">$</span>
              {car.pricePerHour}
              <span className="text-[12px] font-light  text-gray-700"> /day</span>
            </h2>
            <h2 className="mt-[10px] text-[15px] font-bold mb-2  text-gray-700">
              {100} km
            </h2>
          </div>
          <Image
            src="/dene.webp"
            alt="Car"
            width={500}
            height={300}
          />
          <div className="flex justify-around mt-[20px]">
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
                {100} MPG
              </h2>
            </div>
          </div>
        </div>
      
  );
}

export default CarCard