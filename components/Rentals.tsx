"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { CarRental, RentService } from "@/services/rentService";
import {
  FaGasPump,
  FaCogs,
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

type Category = "EASY" | "BASIC" | "COOL" | "COMFORT" | "ELECTRIC";

const categoryColors: { [key in Category]: string } = {
  EASY: "#FFA500",
  BASIC: "#000000",
  COOL: "#800080",
  COMFORT: "#00d4d9",
  ELECTRIC: "#105003",
};

function Rentals() {
  const { user } = useUser();
  const [rentals, setRentals] = useState<null | CarRental[]>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const durationInMilliseconds = end.getTime() - start.getTime();

    const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return { hours, minutes };
  };

  useEffect(() => {
    const fetchAllRentals = async () => {
      try {
        const response = await RentService.getUserAllRentals(user.id);
        console.log(response);
        if (response) {
          // Sort rentals from newest to oldest by startDate
          const sortedRentals = response.sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setRentals(sortedRentals);
        } else {
          setRentals(null);
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };

    if (user?.id) {
      fetchAllRentals();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🚗 Tüm Kiralamalarınız 🚗
      </h1>

      {!rentals || rentals.length === 0 ? (
        <p className="text-center text-gray-500 text-xl font-semibold">
          Şu anda kiralanmış bir aracınız bulunmamaktadır. Lütfen kiralık
          araçlara göz atın ve ihtiyacınıza uygun bir araç kiralayın!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => {
            const duration = calculateDuration(
              rental.startDate,
              rental.endDate
            );
            const categoryColor =
              categoryColors[rental.categoryName as Category];

            // Aşım Süresini Hesapla
            let overdueDuration = null;
            if (rental.endDate && rental.overdueEndDate) {
              overdueDuration = calculateDuration(
                rental.endDate,
                rental.overdueEndDate
              );
            }

            return (
              <div
                key={rental.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaCar className="mr-2" style={{ color: categoryColor }} />
                  <span className="text-gray-900">
                    {rental.brandName} {rental.modelName} ({rental.car.year})
                  </span>
                </h2>
                <div className="mb-4">
                  <p>
                    <strong>Plaka:</strong> {rental.car.plate}
                  </p>
                  <p>
                    <strong>Kategori:</strong>{" "}
                    <span style={{ color: categoryColor }}>
                      {rental.categoryName}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <FaGasPump className="mr-2 text-gray-600" />{" "}
                    <strong>Yakıt Türü:</strong> {rental.fuelTypeName}
                  </p>
                  <p className="flex items-center">
                    <FaCogs className="mr-2 text-gray-600" />{" "}
                    <strong>Vites Türü:</strong> {rental.transsmissionName}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-600" />{" "}
                    <strong>Başlangıç Tarihi:</strong>{" "}
                    {formatDate(rental.startDate)}
                  </p>
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-600" />{" "}
                    <strong>Bitiş Tarihi:</strong>{" "}
                    {rental.endDate ? formatDate(rental.endDate) : "N/A"}
                  </p>
                  <p>
                    <strong>Kiralama Türü:</strong> {rental.rentalType}{" "}
                  </p>
                  <p>
                    <strong>Geçen Süre:</strong> {duration.hours} saat{" "}
                    {duration.minutes} dakika
                  </p>
                  {rental.rentalType === "Daily" && (
                    <div>
                      {overdueDuration ? (
                        <>
                          <p>
                            <strong>Aşım Süresi:</strong>{" "}
                            {overdueDuration.hours} saat{" "}
                            {overdueDuration.minutes} dakika
                          </p>
                          <p>
                            <strong>Aşım Ücreti:</strong>{" "}
                            {rental.totalOverdueFee} TL
                          </p>
                        </>
                      ) : (
                        <p>
                          <strong>Aşım Bilgisi:</strong> Aşım bilgisi yoktur.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-600" />{" "}
                    <strong>Başlangıç Konumu:</strong>{" "}
                    {`(${rental.startLatitude}, ${rental.startLongitude})`}
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-600" />{" "}
                    <strong>Bitiş Konumu:</strong>{" "}
                    {rental.endLatitude && rental.endLongitude
                      ? `(${rental.endLatitude}, ${rental.endLongitude})`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Durum:</strong>{" "}
                    <span
                      className={
                        rental.rentalStatus === "Active"
                          ? "text-[#16a34a] font-bold"
                          : rental.rentalStatus === "Completed"
                          ? "text-gray-500 font-bold"
                          : "text-red-500 font-bold"
                      }
                    >
                      {rental.rentalStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Toplam Fiyat:</strong>{" "}
                    <span className="text-black font-bold">
                      {Math.floor(rental.totalPrice)} TL
                    </span>
                  </p>
                </div>

                <div className="mb-4 mt-4">
                  <h3 className="text-lg font-bold inline-flex items-center gap-2">
                    📷 Kiralama Fotoğrafları
                  </h3>

                  <div className="flex gap-2 overflow-x-auto mt-">
                    {rental.rentalImages.length > 0 ? (
                      rental.rentalImages.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5153/images/${image}`}
                          alt={`Rental ${index + 1}`}
                          className="w-60 h-40 object-contain rounded-lg border border-gray-300"
                          loading="lazy"
                        />
                      ))
                    ) : (
                      <p className="text-gray-800">
                        Kiralamaya ait fotoğraf bulunmamaktadır.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Rentals;
