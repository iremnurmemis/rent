"use client";
import CarList from "@/components/CarList";
import React, { useEffect, useState } from "react";
import {
  CarLocation,
  CarLocationService,
  CarDetail,
} from "@/services/carLocationService";

function CarListPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [carLocations, setCarLocations] = useState<CarLocation[]>([]);
  const [carDetails, setCarDetails] = useState<CarDetail[]>([]);
  const [loading, setLoading] = useState(true); // Yükleme durumu

  useEffect(() => {
    //kullanıcının konumu alınıyor
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude,
            position.coords.latitude,
          ]);
          console.log(userLocation);
        },
        (error) => {
          console.error("geolocationerror:", error);
        }
      );
    }

    //arac konumlarını al
    const fetchCarLocations = async () => {
      try {
        const locations = await CarLocationService.getAvailableCarsLocations();
        setCarLocations(locations);
        //console.log(locations);
      } catch (error) {
        console.error("Araç konumları yüklenemedi: ", error);
      }
    };

    const fetchCarDetails = async () => {
      try {
        const details = await CarLocationService.getAvailableCarsForList();
        setCarDetails(details); // API'den gelen detayları al
        console.log("irem" + details);
      } catch (error) {
        console.error("Araç detayları yüklenemedi: ", error);
      }
    };

    fetchCarLocations();
    fetchCarDetails();
  }, []);

  if (!userLocation) {
    return <div>Yükleniyor...</div>; // Kullanıcı konumu yüklenene kadar bekleme
  }

  return (
    <div className="mt-[150px]">
      <CarList
        userLocation={userLocation}
        cars={carLocations}
        carDetails={carDetails}
        
      />
    </div>
  );
}

export default CarListPage;
