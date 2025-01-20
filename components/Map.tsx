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

  const [rentalType, setRentalType] = useState("Hourly"); // Varsayılan: Saatlik
  const [durationInDays, setDurationInDays] = useState(1); // Günlük kiralama süresi

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
    if (map.current) return; // Harita zaten başlatıldıysa tekrar yükleme
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 10,
    });

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

    map.current.on("load", () => {
      // İstanbul GeoJSON sınırı
      const istanbulBoundary = {
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [28.15572880475275, 41.492196424937205],
                [28.157485797690306, 41.49209303710366],
                [28.202961051382243, 41.54010039762167],
                [28.203024212408057, 41.540167105596815],
                [28.232758010821577, 41.51898835988814],
                [28.384287966119278, 41.44745520436395],
                [28.600840684315568, 41.37750881269547],
                [28.90845787999614, 41.2665469484126],
                [29.007578970243117, 41.24966053771964],
                [29.012868681935082, 41.24811429890466],
                [29.01514733168301, 41.245794986964476],
                [29.017832878340695, 41.24371978976707],
                [29.024261911472063, 41.24282458835572],
                [29.031993030212828, 41.24494046628416],
                [29.03825930775947, 41.254339890220365],
                [29.04517663254578, 41.256415128729024],
                [29.068695506168254, 41.25372954086008],
                [29.093923370851883, 41.24640532724712],
                [29.109222854097503, 41.23529695542718],
                [29.099864133264166, 41.21039462533379],
                [29.086761912059945, 41.19188058213039],
                [29.069346546108875, 41.17470935199407],
                [29.052256706233855, 41.167141013071564],
                [29.040782096386604, 41.16429270605193],
                [29.043304888031805, 41.15766024895086],
                [29.051442902850518, 41.14984770916372],
                [29.05738365950728, 41.141546938827496],
                [29.06373131740319, 41.13446687303358],
                [29.065684442396186, 41.132961338988494],
                [29.070648635441234, 41.13019441227822],
                [29.06869550535063, 41.12445707449829],
                [29.064463735358636, 41.11957426898366],
                [29.062266472002573, 41.119330145015994],
                [29.058604367937445, 41.09959547683968],
                [29.05152428497833, 41.081773178859635],
                [29.04216556251112, 41.06635163976357],
                [29.031504749611962, 41.05385973962169],
                [29.02328535451696, 41.04881421128501],
                [29.00554447188476, 41.04450107563061],
                [28.997325069865596, 41.03986239704287],
                [28.989512568722777, 41.03107332665033],
                [28.98804772645231, 41.02578362487018],
                [28.98853600164516, 41.02163318972727],
                [28.989593942078145, 41.017075888560655],
                [28.992523638710114, 41.01365797555296],
                [28.992360873521836, 41.0082054743855],
                [28.986501502176232, 41.0026309541081],
                [28.981944207353628, 41.00165436629538],
                [28.96045982619114, 41.002997099260206],
                [28.95183352898472, 41.008612365403344],
                [28.946136919084033, 41.009466890538896],
                [28.940440296863493, 41.00682198661165],
                [28.931651237114508, 40.99774810823959],
                [28.928396024286275, 40.99579495182613],
                [28.917491083833752, 40.99359773493551],
                [28.899261918074252, 40.98427971003073],
                [28.859548368728987, 40.97801338612513],
                [28.849945505654162, 40.97528715515326],
                [28.84424888884883, 40.97190986435388],
                [28.840017123955768, 40.96767813324449],
                [28.833750844198, 40.96393461868501],
                [28.82203209881254, 40.96161531385265],
                [28.797618033961395, 40.962551167201994],
                [28.78598066260951, 40.965643606350014],
                [28.781016470883067, 40.97186920068804],
                [28.770192901259424, 40.97931547251252],
                [28.745290555325823, 40.98016995182357],
                [28.62525475087506, 40.968410528429395],
                [28.59522545684914, 40.977972722005795],
                [28.603526242035723, 41.009466890538896],
                [28.591807491499864, 41.018866301015365],
                [28.58480878768373, 41.02204009076572],
                [28.575531444169613, 41.02366769795807],
                [28.58253014038476, 41.046372765244676],
                [28.57243900221108, 41.06647372765606],
                [28.55193119150587, 41.080511822164404],
                [28.527842645739113, 41.08515046943001],
                [28.532888222390806, 41.070624126446944],
                [28.554535351700967, 41.05365631503338],
                [28.562510611804953, 41.03676991613848],
                [28.56283613262284, 41.026678768936925],
                [28.560313345929565, 41.01227447395041],
                [28.553558790766463, 40.998358471051226],
                [28.541351756739086, 40.98956938808667],
                [28.51246178158954, 40.99266182848423],
                [28.46070397735842, 41.032863709378994],
                [28.43531335015391, 41.04291415083329],
                [28.402191606114034, 41.047308688202314],
                [28.332774283355572, 41.06655506910836],
                [28.298106315614667, 41.070868228444795],
                [28.264008008615118, 41.070868228444795],
                [28.255869984494286, 41.07318754372418],
                [28.244965040386642, 41.08295319456654],
                [28.23666426072133, 41.08515046943001],
                [28.199473505589413, 41.07855867157074],
                [28.18165124105529, 41.077704189333886],
                [28.174733914638264, 41.08083727220879],
                [28.162963499339963, 41.13645582659862],
                [28.149320920423317, 41.213040298457436],
                [28.162963487123218, 41.2732432620527],
                [28.193039172618334, 41.35530545568377],
                [28.18208377302551, 41.42096038209998],
                [28.15572880475275, 41.492196424937205],
              ],
            ],
            [
              [
                [29.253672719743275, 40.875474336405475],
                [29.24097741309759, 40.88255444903383],
                [29.220469595950885, 40.87970611520851],
                [29.20134524343849, 40.8939476284716],
                [29.144785998198902, 40.914129912406935],
                [29.124278191869713, 40.92690664863638],
                [29.103526241671496, 40.946722746792275],
                [29.083181191200183, 40.95966221070396],
                [29.02808678717798, 40.98212312812906],
                [29.032074418409547, 40.98403557111405],
                [29.03288821602294, 40.98456451366278],
                [29.032888215104858, 40.985663140709036],
                [29.034841339699984, 40.98956938808667],
                [29.023285353365726, 40.99335359185684],
                [29.018321165764725, 41.00389235737597],
                [29.01465905370146, 41.017523528988065],
                [29.007578975547098, 41.03050367098031],
                [29.026052284291936, 41.038275485779465],
                [29.046153190114545, 41.05548736627652],
                [29.062347847542995, 41.07632067623334],
                [29.076182486881258, 41.114406635793905],
                [29.08814538483268, 41.12885166752907],
                [29.090586781171652, 41.14093656638098],
                [29.06910241538528, 41.152777445638755],
                [29.092621295374506, 41.18036533650238],
                [29.130056188668405, 41.211900149086055],
                [29.16968834642387, 41.23309967331857],
                [29.1999617820089, 41.22919340790615],
                [29.206228058008207, 41.22919340790615],
                [29.216156440609286, 41.23940660862208],
                [29.231781444872485, 41.2407087188135],
                [29.4196069640372, 41.214300829216896],
                [29.618825712398205, 41.1789004289806],
                [29.884613482539255, 41.148993265662355],
                [29.863428179103604, 41.14203687342848],
                [29.87366010601137, 41.11144438668312],
                [29.87738081285103, 41.07981843320573],
                [29.84937218658988, 41.02938223412023],
                [29.794801869921272, 41.00674792403373],
                [29.730619748046767, 40.98775688401496],
                [29.67274214530564, 40.95693190638255],
                [29.663750436001262, 40.93279894533535],
                [29.646593867559176, 40.909932168435944],
                [29.61104048127484, 40.906909094814786],
                [29.581791615986436, 40.92525419100132],
                [29.550992460225014, 40.97414008552878],
                [29.50365685128198, 41.00501677093511],
                [29.450946888896937, 41.008608276044875],
                [29.407021921460167, 40.98411364406221],
                [29.365164009068682, 40.95272020559671],
                [29.34015262554913, 40.943263475982754],
                [29.28775272040272, 40.90944123111479],
                [29.253672719743275, 40.875474336405475],
              ],
            ], // Örnek koordinatlar, kendi GeoJSON verinizi buraya koyun
          ],
        },
      };

      // İstanbul dışını karartmak için mask layer
      map.current?.addSource("mask", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "MultiPolygon",
                coordinates: [
                  [
                    [
                      [-180, -90], // Sol alt köşe (Güney, Batı)
                      [180, -90], // Sağ alt köşe (Güney, Doğu)
                      [180, 90], // Sağ üst köşe (Kuzey, Doğu)
                      [-180, 90], // Sol üst köşe (Kuzey, Batı)
                      [-180, -90], // Tekrar başa dönüyoruz
                    ],
                    istanbulBoundary.geometry.coordinates[0][0],
                    istanbulBoundary.geometry.coordinates[1][0],
                  ],
                ],
              },
              properties: {},
            },
          ],
        },
      });

      map.current?.addLayer({
        id: "mask-layer",
        type: "fill",
        source: "mask",
        layout: {},
        paint: {
          "fill-color": "rgba(0, 0, 0, 0.5)", // Karartma rengi
          "fill-opacity": 0.8,
        },
      });
    });
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
            setSelectedCarDistance(distance);
            setSelectedCarDuration(duration);
            setShowCard(true); // Kartı göster
          });
        }
      });
    }
  }, [carLocations]);

  useEffect(() => {
    if (selectedCar) {
      // SelectedCar değiştiğinde mesafe ve süreyi ayarla
      // Gerekirse burada mesafe ve süreyi yeniden hesaplayabilirsiniz.
    }
  }, [selectedCar]);

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

  const handleCarSelect = (carId: number) => {
    localStorage.setItem("selectedCarId", carId.toString());
    window.location.href = "/credit-card";
  };

  const goToCreditCardPage = () => {
    if (selectedCar) {
      localStorage.setItem("selectedCarId", selectedCar.carId.toString());
      localStorage.setItem('rentalType', rentalType === "Hourly" ? "0" : "1");
      localStorage.setItem('durationInDays', rentalType === "Daily" ? durationInDays.toString() : "0");
    }
    router.push("/credit-card");
  };

  const handleRentalTypeSelect = (type: any) => {
    setRentalType(type);
  };

  const handleProceed = () => {
    if (rentalType === "Daily" && durationInDays <= 0) {
      alert("Günlük kiralamada geçerli bir gün sayısı giriniz!");
      return;
    }
    goToCreditCardPage();
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
              <div className="flex justify-between ">
                <h2 className="text-[18px] font-medium mb-2 text-gray-700">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                <h2
                  className="text-[18px] font-medium  text-gray-700 mr-4"
                  style={{
                    color: categoryColors[selectedCar.category] || "#000000",
                  }}
                >
                  {selectedCar.category}
                </h2>
                <FaTimes
                  onClick={(e) => {
                    e.stopPropagation(); // Tıklama olayını yayılmasını engelle
                    closeCard(); // Sadece kartı kapat
                  }}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    cursor: "pointer",
                    color: "gray",
                    fontSize: "20px",
                  }}
                />
              </div>
              <div className="flex justify-between">
                <h2 className="text-[20px] font-bold mb-2 text-gray-700">
                  <span className="text-[12px] font-light ">TL </span>
                  {selectedCar.pricePerHour}
                  <span className="text-[12px] font-light text-gray-700">
                    {" "}
                    /saat
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-4xl sm:w-[90%] md:w-[80%] lg:w-[700px] xl:w-[700px] h-full sm:h-[760px] mb-10 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <FaTimes onClick={closePopup} className="text-[18px] absolute " /> */}

            <div className="flex justify-center gap-3 text-[18px]  ">
              <p>{selectedCar?.brand}</p>
              <p>{selectedCar?.model}</p>
            </div>

            {/* Slider Logic Inside Modal */}
            <div>
              <div className="relative mt-2 flex items-center justify-center">
                <button
                  onClick={goToPrev}
                  className="absolute left-0 text-[#002e67] p-3 z-10 "
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
                  className="absolute right-0 text-[#002e67] p-3 z-10 "
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

            <div className="flex justify-around items-center text-[18px] mt-4">
              {/* Car Category */}
              {selectedCar?.category ? (
                <p
                  className="ml-[76px]"
                  style={{
                    color: categoryColors[selectedCar.category] || "#000000",
                  }}
                >
                  {selectedCar.category}
                </p>
              ) : (
                <p>Loading category...</p>
              )}

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
                  <div className="bg-blue-600 text-white px-4 py-2">TR</div>
                  {/* Car Plate Number */}
                  <div className="py-2 mx-3">{selectedCar?.plate}</div>
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
            {/* Saatlik ve Günlük Seçim */}
            <div className="flex flex-col items-center mt-6">
              <div className="flex gap-6 mb-4">
                {/* Saatlik Butonu */}
                <button
                  className={`flex flex-col items-center text-center text-[8px] font-bold px-6 py-2 rounded-lg ${
                    rentalType === "Hourly"
                      ? "bg-green-500 text-white"
                      : "bg-white text-black border border-black"
                  }`}
                  onClick={() => handleRentalTypeSelect("Hourly")}
                >
                  <span className="text-[16px] font-medium mb-1">
                    Saatlik Kirala
                  </span>
                  <span className="text-[14px] font-normal">
                    {selectedCar?.pricePerHour} TL /saat
                  </span>
                </button>

                {/* Günlük Butonu */}
                <button
                  className={`flex flex-col items-center text-center text-[8px] font-bold px-6 py-2 rounded-lg ${
                    rentalType === "Daily"
                      ? "bg-green-500 text-white"
                      : "bg-white text-black border border-black"
                  } `}
                  onClick={() => handleRentalTypeSelect("Daily")}
                >
                  <span className="text-[16px] font-medium mb-1">
                    Günlük Kirala
                  </span>
                  <span className="text-[14px] font-normal">
                    {selectedCar?.pricePerDay} TL /gün
                  </span>
                </button>
              </div>
              {/* Günlük Kiralama Süresi */}
              {rentalType === "Daily" && (
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <label className="text-[16px] font-medium text-gray-700">
                      Kaç gün kiralayacaksın?
                    </label>
                    <input
                      type="number"
                      value={durationInDays}
                      min={1}
                      onChange={(e) =>
                        setDurationInDays(Number(e.target.value))
                      }
                      className="w-20 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    />
                  </div>

                  {/* Süre Ücreti ve Hesaplanan Değer */}
                  <div className="flex items-center gap-4">
                    <p className="text-[16px] font-medium text-gray-700">
                      Süre Ücreti
                    </p>
                    <p className="text-[18px] font-medium text-gray-700">
                      {selectedCar?.pricePerDay
                        ? selectedCar.pricePerDay * durationInDays
                        : 0}{" "}
                      TL
                    </p>
                  </div>
                </div>
              )}

              {/* Hemen Kirala Butonu */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleProceed}
                  className="bg-[#002e67] text-white text-[18px] font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Hemen Kirala
                </button>
              </div>
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
  height: "auto",
  width: "250px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  position: "absolute" as "absolute",
  bottom: "40px",
  right: "80px",
  zIndex: 10,
};

export default Map;
