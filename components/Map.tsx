import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import { FaCarSide, FaCircleUser } from "react-icons/fa6";
import { FaWalking, FaTimes } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  CarImage,
  CarLocation,
  CarLocationService,
} from "../services/carLocationService";
import Image from "next/image";
import { FaGasPump } from "react-icons/fa";
import { MdAirlineSeatLegroomNormal } from "react-icons/md";
import { PiSteeringWheelFill } from "react-icons/pi";
const MapboxDirections = require("@mapbox/mapbox-sdk/services/directions");
import { useSpring, animated, useTransition } from "react-spring";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXJlbW51cm1lbWlzIiwiYSI6ImNtNGw0YmV2MTBnMTIybXNoNGdhYzR4cmIifQ.4d7egCMhLPs0K6PSG2pesg";

interface MapProps {
  userLocation: [number, number];
  carLocations: CarLocation[];
}

const Map: React.FC<MapProps> = ({ userLocation, carLocations }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const directionsClient = MapboxDirections({
    accessToken: mapboxgl.accessToken,
  });
  const [selectedCar, setSelectedCar] = useState<CarLocation | null>(null); // Seçilen araç durumu
  const [selectedCarDistance, setSelectedCarDistance] = useState<number | null>(
    null
  );
  const [selectedCarDuration, setSelectedCarDuration] = useState<number | null>(
    null
  );
  const [showCard, setShowCard] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [carimages, setImage] = useState<CarImage[]>([]);

  const router = useRouter();

  const categoryColors: { [key: string]: string } = {
    EASY: "#FFA500",
    BASIC: "#000000",
    COOL: "#800080",
    COMFORT: "#00d4d9",
    ELECTRIC: "#105003",
  };

  const cardAnimation = useSpring({
    opacity: showCard ? 1 : 0, // Kart görünürse opaklık 1, değilse 0
    transform: showCard ? "translateX(0)" : "translateX(-10px)", // Az kaydırma
    config: { tension: 300, friction: 45 }, // Hızlı ve belirgin geçiş
  });

  useEffect(() => {
    if (map.current) return;

    if (userLocation) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLElement,
        style: "mapbox://styles/mapbox/streets-v11",
        center: userLocation,
        zoom: 12,
      });

      // Kullanıcı marker'ı ekle
      const iconContainer = document.createElement("div");
      iconContainer.style.fontSize = "25px";
      const root = createRoot(iconContainer);
      root.render(
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#0032c6",
            color: "#FFFFFF",
          }}
        >
          <FaCircleUser />
        </div>
      );
      new mapboxgl.Marker(iconContainer)
        .setLngLat(userLocation)
        .addTo(map.current);
    }
  }, [userLocation]);

  useEffect(() => {
    if (isPopupOpen) {
      // Modal açıkken body kaydırmayı devre dışı bırak
      document.body.style.overflow = "hidden";
    } else {
      // Modal kapalıyken body kaydırmayı eski haline getir
      document.body.style.overflow = "auto";
    }

    // Cleanup: Modal kapandığında overflow'u geri al
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  useEffect(() => {
    if (map.current && carLocations) {
      // Eski marker'ları kaldır
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Eski popup'ları kaldır
      popups.current.forEach((popup) => popup.remove());
      popups.current = [];

      console.log(carLocations);

      carLocations.forEach(async (car) => {
        if (car.latitude && car.longitude) {
          const markerContainer = document.createElement("div");
          markerContainer.style.fontSize = "25px";
          const color = categoryColors[car.category] || "#000000"; // Kategoriye göre renk

          const root = createRoot(markerContainer);
          root.render(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: color,
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <FaCarSide
                style={{
                  color: color,
                  fontSize: "24px",
                  stroke: "#FFFFFF",
                  strokeWidth: "30",
                }}
              />
            </div>
          );

          const marker = new mapboxgl.Marker(markerContainer)
            .setLngLat([car.longitude, car.latitude])
            .addTo(map.current!);
          markers.current.push(marker); // Marker'ı kaydet

          // Harita üzerindeki yürüyüş süresi ve mesafe hesaplama
          const directionsClient = MapboxDirections({
            accessToken: mapboxgl.accessToken,
          });

          const response = await directionsClient
            .getDirections({
              profile: "walking",
              waypoints: [
                { coordinates: userLocation },
                { coordinates: [car.longitude, car.latitude] },
              ],
            })
            .send();

          const route = response.body.routes[0];
          const duration = Math.ceil(route.duration / 60); // Saniyeden dakikaya çevir
          const distance = route.distance / 1000; // Metreden kilometreye çevir

          setSelectedCarDistance(distance);
          setSelectedCarDuration(duration);
          // Popup için React içeriği oluştur
          const popupContent = document.createElement("div");
          const popupRoot = createRoot(popupContent);
          popupRoot.render(
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "14px",
                color: "#FFFFFF",
                backgroundColor: "#000000",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FaWalking style={{ color: "#FFFFFF", fontSize: "18px" }} />
                <strong>{duration} dk</strong>
              </div>
              <span style={{ fontSize: "12px", color: "#FFFFFF" }}>
                ({distance.toFixed(2)} km uzaklıkta)
              </span>
            </div>
          );

          // Popup'u ekle
          const popup = new mapboxgl.Popup({ closeButton: false, offset: 25 })
            .setDOMContent(popupContent)
            .setLngLat([car.longitude, car.latitude]);
          popups.current.push(popup);

          // Marker hover durumunda popup göster
          marker
            .getElement()
            .addEventListener("mouseenter", () => popup.addTo(map.current!));
          marker
            .getElement()
            .addEventListener("mouseleave", () => popup.remove());

          // Marker tıklama durumunda seçilen aracı güncelle
          marker.getElement().addEventListener("click", () => {
            setSelectedCar(car);
            setShowCard(true); // Kartı göster
          });
        }
      });
    }
  }, [carLocations]);

  useEffect(() => {
    if (selectedCar != null) {
      const fetchCarImages = async () => {
        try {
          const response = await CarLocationService.getAllCarImages(
            selectedCar.carId
          );
          setImage(response);
          console.log("iremmmmmmm" + carimages);
        } catch (error) {
          console.error("Resimleri çekerken hata oluştu:", error);
        }
      };

      fetchCarImages();
    }
  }, [selectedCar]);

  useEffect(() => {
    console.log("Güncellenen carimages durumu:", carimages);
  }, [carimages]); // carimages durumunun değiştiğini yazdır

  const closeCard = () => {
    setShowCard(false); // Kartı kapat
    setSelectedCar(null);
  };

  const handleCardClick = () => {
    console.log("deneme");
    setIsPopupOpen(true);
    console.log(isPopupOpen);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToNext = (e: any) => {
    e.stopPropagation(); // Prevent the popup from closing
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carimages.length);
  };
  const goToPrev = (e: any) => {
    e.stopPropagation(e); // Prevent the popup from closing
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carimages.length) % carimages.length
    );
  };

  const goToSlide = (index: any, e: any) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        ref={mapContainer}
        style={{
          width: "90vw",
          height: "75vh",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          marginTop: "15px",
          position: "relative",
        }}
      />
      <div style={{ marginTop: "15px" }}>
        {selectedCar && showCard && (
          <animated.div style={{ ...cardStyle, ...cardAnimation }}>
            <div onClick={() => handleCardClick()}>
              <div className="flex justify-between">
                <h2 className="text-[18px] font-medium mb-2 text-gray-700">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                <h2 className="text-[18px] font-medium mb-2 text-gray-700">
                  {selectedCar.category}
                </h2>
                <FaTimes
                  onClick={(e) => {
                    e.stopPropagation(); // Tıklama olayını yayılmasını engelle
                    closeCard(); // Sadece kartı kapat
                  }}
                  style={{
                    cursor: "pointer",
                    color: "gray",
                    fontSize: "18px",
                  }}
                />
              </div>
              <div className="flex justify-between">
                <h2 className="text-[20px] font-bold mb-2 text-gray-700">
                  <span className="text-[12px] font-light ">$</span>
                  {selectedCar.pricePerHour}
                  <span className="text-[12px] font-light text-gray-700">
                    {" "}
                    /day
                  </span>
                </h2>
                <h2 className="mt-[10px] text-[15px] font-bold mb-2 text-gray-700">
                  {selectedCarDistance
                    ? `${selectedCarDistance.toFixed(2)} km`
                    : "--"}
                </h2>
              </div>
              <Image src="/dene.webp" alt="Car" width={500} height={300} />
              <div className="flex justify-around mt-[20px]">
                <div className="text-center text-gray-700">
                  <PiSteeringWheelFill className="w-full text-[22px] mb-2" />
                  <h2 className="line-clamp-5 text-[14px] font-light">
                    {selectedCar.transmission}
                  </h2>
                </div>
                <div className="text-center text-gray-700">
                  <MdAirlineSeatLegroomNormal className="w-full text-[22px] mb-2" />
                  <h2 className="line-clamp-5 text-[14px] font-light">
                    {selectedCar.seatCount}X
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
          </animated.div>
        )}
      </div>

      {isPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-[700px] h-[700px] mb-10 "
            onClick={(e) => e.stopPropagation()}
          >
            {/* <FaTimes onClick={closePopup} className="text-[18px] absolute " /> */}

            <div className="flex justify-center gap-3 text-[18px] mt-3 ">
              <p>{selectedCar?.brand}</p>
              <p>{selectedCar?.model}</p>
            </div>

            {/* Slider Logic Inside Modal */}
            <div>
              <div className="relative mt-4 flex items-center justify-center">
                <button
                  onClick={goToPrev}
                  className="absolute left-0  text-[#002e67]  p-3 z-10 "
                >
                  <FaChevronLeft size={20} />
                </button>
                <img
                  src={`http://localhost:5153/images/${carimages[currentIndex].imagePath}`}
                  className="w-[80%] h-[300px] object-contain rounded-lg"
                  alt="Car"
                />
                <button
                  onClick={goToNext}
                  className="absolute right-0 text-[#002e67]  p-3 z-10 "
                >
                  <FaChevronRight size={20} />
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {carimages.map((_, index) => (
                  <span
                    key={index}
                    onClick={(e) => goToSlide(index, e)}
                    className={`h-2 w-2 rounded-full cursor-pointer ${
                      index === currentIndex ? "bg-[#002e67]" : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            <div className=" flex justify-around items-center text-[18px] mt-3">
              {/* Car Category */}
              <p className="ml-[90px]">{selectedCar?.category}</p>

              <div className="flex items-center border-2 border-gray-700 rounded-md ml-[40px]">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FaWalking style={{ color: "#000000", fontSize: "18px" }} />
                  <h2 className="pr-[8px]">{selectedCarDuration} dk</h2>
                </div>
              </div>

              <div className="mr-[5px]">
                {/* Plate and TR */}
                <div className="flex items-center border-2 border-blue-600 rounded-md">
                  {/* "TR" Label with Blue Background */}
                  <div className="bg-blue-600 text-white px-4 py-2 ">TR</div>
                  {/* Car Plate Number */}
                  <div className=" py-2 mx-3">{selectedCar?.plate}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-around mt-[20px] border-2 rounded-lg m-10 py-2 ">
              <div className="text-center text-gray-700">
                <PiSteeringWheelFill className="w-full text-[22px] mb-2" />
                <h2 className="line-clamp-5 text-[14px] font-light">
                  {selectedCar?.transmission}
                </h2>
              </div>
              <div className="text-center text-gray-700">
                <MdAirlineSeatLegroomNormal className="w-full text-[22px] mb-2" />
                <h2 className="line-clamp-5 text-[14px] font-light">
                  {selectedCar?.seatCount}X
                </h2>
              </div>
              <div className="text-center text-gray-700">
                <FaGasPump className="w-full text-[22px] mb-2" />
                <h2 className="line-clamp-5 text-[14px] font-light">
                  {120} MPG
                </h2>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              {/* Price */}
              <h2 className="ml-[100px] text-[20px] font-bold text-gray-700">
                <span className="text-[14px] font-normal text-gray-900">
                  TL{" "}
                </span>
                {selectedCar?.pricePerHour}
                <span className="text-[14px] font-normal text-gray-900">
                  {" "}
                  /day
                </span>
              </h2>

              <button
                onClick={() => router.push("/credit-card")}
                className="mr-[40px] bg-[#002e67] text-white text-[18px] font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Hemen Kirala
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  background: "#f4f4f4",
  borderRadius: "8px",
  padding: "16px",
  //margin: " 10px 0px",
  //height: "330px",
  width: "230px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  position: "absolute" as "absolute",
  bottom: "40px",
  right: "80px",
  zIndex: 10,
};

export default Map;
