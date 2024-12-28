"use client";
import Map from "@/components/Map";
import React, { useEffect, useState } from "react";
import {
  CarLocation,
  CarLocationService,
  CarDetail,
} from "@/services/carLocationService";
import { useRouter } from "next/navigation";
import Slider from "@mui/material/Slider";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { Category, CarFilterService, Brand } from "@/services/carFilterService";

function CarsPage() {
  const router = useRouter();

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [carLocations, setCarLocations] = useState<CarLocation[]>([]);
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  ); //SECİLİ KATEGORY BUTONUNUN RENGİNİ DEĞİŞTİRMEK VE FİLTRE UYG UYGULAMAYACAGININ KARARINI VERMEK İÇİN
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null); //secili brand filtresi var mı?
  const [priceRange, setPriceRange] = useState<number[]>([0, 1300]);

  const filterCars = async (
    categoryId: number | null,
    brandId: number | null,
    priceRange: number[]
  ) => {
    try {
      setLoading(true);
      const allCars = await CarLocationService.getAvailableCarsLocations();
      const filteredCars = allCars.filter((car) => {
        const matchesCategory = categoryId
          ? car.categoryId === categoryId
          : true;
        const matchesBrand = brandId ? car.brandId === brandId : true;
        const matchesPrice =
          car.pricePerHour >= priceRange[0] &&
          car.pricePerHour <= priceRange[1];
        return matchesCategory && matchesBrand && matchesPrice;
      });
      setCarLocations(filteredCars);
      console.log("Filtrelenmiş araçlar:", filteredCars);
    } catch (error) {
      console.error("Araçlar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //kullanıcının konumu alınıyor
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude,
            position.coords.latitude,
          ]);
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
      } catch (error) {
        console.error("Araç konumları yüklenemedi: ", error);
      }
    };
    fetchCarLocations();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CarFilterService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error("Kategorileri çekerken hata oluştu:", error);
      }
    };
    const fetchBrands = async () => {
      try {
        const response = await CarFilterService.getBrands();
        setBrands(response);
      } catch (error) {
        console.error("markalar çekerken hata oluştu:", error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, [carLocations]);

  useEffect(() => {
    filterCars(selectedCategoryId, selectedBrandId, priceRange);
  }, [priceRange]);

  if (!userLocation) {
    return <div>Yükleniyor...</div>; // Kullanıcı konumu yüklenene kadar bekleme
  }

  //drawer acıyor
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategoryId);
    filterCars(newCategoryId, selectedBrandId, priceRange);
  };

  const handleBrandFilterClick = (brandId: number) => {
    const newBrandId = selectedBrandId === brandId ? null : brandId;
    setSelectedBrandId(newBrandId);
    filterCars(selectedCategoryId, newBrandId, priceRange);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleUygula=()=>{
    setDrawerOpen(false);
  }



  return (
    <div>
      <div className="mt-[130px]">
        <div className="flex justify-between">
          <div className="ml-[80px]">
          <button
          onClick={() => router.push("/car-list")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Araçları Listele
        </button>
          </div>
          <div className="mr-[20px]">
          <Button
            variant="contained"
            style={{
              color: "black",
              border: "1px solid black", // Siyah kenarlık
              backgroundColor: "white", // Arka plan beyaz
              borderRadius: "10px",
              marginRight: "55px",
            }}
            onClick={toggleDrawer(true)}
          >
            Filtrele
          </Button>

          </div>
       
          

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            ModalProps={{
              BackdropProps: {
                style: { backgroundColor: "transparent" },
              },
            }}
          >
            <div className="w-[350px] p-[20px] flex flex-col h-full bg-white">
              <h2 className="text-lg font-bold mb-4 text-center">Filtrele</h2>
              <hr className="-mx-5 bg-gray-300 h-[8px] mb-5 border-none" />

              {/* Araç Kategorileri */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Araç Kategorileri</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 border text-sm rounded-full 
                      ${
                        selectedCategoryId === category.id
                          ? "border-gray-300 text-gray-300 bg-black"
                          : "border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="-mx-5 bg-gray-300 h-[8px] mb-5 border-none" />

              {/* Marka */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Marka</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(brands.map((carDetail) => carDetail.name))].map(
                    (name) => {
                      // Burada, aynı marka adına sahip tüm carDetails'lerden marka ID'sini alıyoruz.
                      const id = brands.find(
                        (brand) => brand.name === name
                      )?.id;

                      if (id === undefined) return null;
                      return (
                        <button
                          key={id}
                          className={`px-4 py-2 border text-sm rounded-full 
                      ${
                        selectedBrandId === id
                          ? "border-gray-300 text-gray-300 bg-black"
                          : "border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                          onClick={() => handleBrandFilterClick(id)}
                        >
                          {name}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <hr className="-mx-5 bg-gray-300 h-[8px] mb-5 border-none" />
              {/* Fiyat Aralığı */}
              <div className="mb-6">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2">Fiyat Aralığı(Saatlik)</h3>
                  <p>
                    {priceRange[0]}-{priceRange[1]}
                  </p>
                </div>

                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1300}
                  step={10}
                  style={{ color: "black" }}
                />
              </div>

              <hr className="-mx-5 bg-gray-300 h-[8px] mb-5 border-none" />

              {/* Uygula Butonu */}
              <div className="mt-auto">
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    backgroundColor: "black",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                  onClick={handleUygula}
                >
                  Uygula
                </Button>
              </div>
            </div>
          </Drawer>
        </div>
      </div>

      <div>
        <Map userLocation={userLocation} carLocations={carLocations} />
      </div>

      <div style={{ textAlign: "center", marginTop: "800px" }}>
      
      </div>
    </div>
  );
}

export default CarsPage;
