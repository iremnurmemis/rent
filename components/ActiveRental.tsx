"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { CarRental, RentService } from "@/services/rentService";
import { FaGasPump, FaCogs, FaCar } from "react-icons/fa";
import { useRouter } from "next/navigation";

function ActiveRental() {
  const { user } = useUser();
  const router = useRouter();
  const [activeRental, setActiveRental] = useState<null | CarRental>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const calculateRentalDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const durationInMilliseconds = now.getTime() - start.getTime();

    const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return { hours, minutes, durationInMinutes };
  };

  const calculateEstimatedPrice = (
    pricePerHour: number,
    durationInMinutes: number
  ) => {
    const durationInHours = durationInMinutes / 60; // Süreyi saat cinsine çevir
    const totalPrice = durationInHours * pricePerHour;
    return totalPrice;
  };

  useEffect(() => {
    const fetchActiveRental = async () => {
      console.log("iremmmm", activeRental?.rentalType);
      try {
        const response = await RentService.getUserActiveRentals(user.id);

        if (response) {
          setActiveRental(response);
        } else {
          setActiveRental(null);
        }
      } catch (error) {
        console.log("Error fetching active rental:", error);
      }
    };

    if (user?.id) {
      fetchActiveRental();
    }
  }, [user]);

  // Fotoğraf yükleme işlemi
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length <= 4) {
        // Maksimum 4 fotoğraf
        setImages(files);
      } else {
        alert("Lütfen sadece 4 fotoğraf yükleyin.");
      }
    }
  };

  
  const handleEndRental = async (rentalId: number) => {
    if (!isImageUploadVisible) {
      setIsImageUploadVisible(true); 
      return;
    }

    if (images.length !== 4) {
      alert("Lütfen 4 adet fotoğraf yükleyin.");
      return;
    }

    if (isSubmitting) return; // Çift istek atılmasını engelle
    setIsSubmitting(true);

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    try {
      await RentService.endRental(formData, rentalId);
      showSuccessAlert("İade işlemi tamamlandı. Bizi tercih ettiğiniz için teşekkürler!", () => {
        router.push("/");
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "İşlem tamamlanamadı.";
      showErrorAlert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };



  const showSuccessAlert = (message: string, onClose?: () => void) => {
    const alertDiv = document.createElement("div");
    alertDiv.textContent = message;
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.padding = "15px";
    alertDiv.style.backgroundColor = "green";
    alertDiv.style.color = "white";
    alertDiv.style.fontSize = "16px";
    alertDiv.style.borderRadius = "10px";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    alertDiv.style.maxWidth = "500px";
    alertDiv.style.textAlign = "center";

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
      if (onClose) onClose(); // Alert kapandıktan sonra callback çalıştır
    }, 2000);
  };

  const showErrorAlert = (message: string) => {
    const alertDiv = document.createElement("div");
    alertDiv.textContent = `HATA: ${message}`;
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.padding = "15px";
    alertDiv.style.backgroundColor = "red";
    alertDiv.style.color = "white";
    alertDiv.style.fontSize = "16px";
    alertDiv.style.borderRadius = "10px";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    alertDiv.style.display = "flex";
    alertDiv.style.flexDirection = "column";
    alertDiv.style.alignItems = "center";
    alertDiv.style.maxWidth = "500px";

    // Eğer rentaltype 1 ise "Kart Seç" butonunu ekleme
    if (activeRental?.rentalType !== "Daily") {
      const changeCardButton = document.createElement("button");
      changeCardButton.textContent = "Kart Seç";
      changeCardButton.style.marginTop = "10px";
      changeCardButton.style.padding = "10px 20px";
      changeCardButton.style.backgroundColor = "white";
      changeCardButton.style.color = "red";
      changeCardButton.style.border = "1px solid red";
      changeCardButton.style.borderRadius = "5px";
      changeCardButton.style.cursor = "pointer";

      changeCardButton.onclick = () => {
        alertDiv.remove();
        router.push("/credit-card-select");
      };

      alertDiv.appendChild(changeCardButton);
    }

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  };

  const calculateOverdueFee = (
    pricePerHour: number,
    endDate: string | null
  ) => {
    const now = new Date();
    const end = endDate ? new Date(endDate) : now;

    // Geçen süreyi hesapla
    const durationInMilliseconds = now.getTime() - end.getTime();
    const durationInMinutes = Math.max(
      Math.floor(durationInMilliseconds / (1000 * 60)),
      0
    );

    // Aşım süresi
    const overdueHours = Math.floor(durationInMinutes / 60);
    const overdueMinutes = durationInMinutes % 60;

    // Aşım ücreti (sadece aşım süresi 1 saatten büyükse hesaplanır)
    const overdueFee = overdueHours > 0 ? overdueHours * pricePerHour : 0;

    return {
      overdueHours,
      overdueMinutes,
      overdueFee,
      display: `${overdueHours} saat ${overdueMinutes} dakika`,
    };
  };

  return (
    <div className="container mx-auto p-8">
      {activeRental ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            Aktif Kiralama Bilgileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Araç Bilgileri */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaCar className="mr-2 text-gray-600" /> Araç Bilgileri
              </h3>
              <p>
                <strong>Marka:</strong> {activeRental.brandName}
              </p>
              <p>
                <strong>Model:</strong> {activeRental.modelName}
              </p>
              <p>
                <strong>Kategori:</strong> {activeRental.categoryName}
              </p>
              <p>
                <strong>Yıl:</strong> {activeRental.car.year}
              </p>
              <p>
                <strong>Plaka:</strong> {activeRental.car.plate}
              </p>
              <p className="flex items-center">
                <FaGasPump className="mr-2 text-gray-600" />{" "}
                <strong>Yakıt Türü:</strong> {activeRental.fuelTypeName}
              </p>
              <p className="flex items-center">
                <FaCogs className="mr-2 text-gray-600" />{" "}
                <strong>Vites Türü:</strong> {activeRental.transsmissionName}
              </p>
            </div>

            {/* Tarih, Fiyat ve Durum Bilgileri */}
            <div className="bg-gray-100 p-4 rounded-lg relative">
              <div className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold">
                {activeRental.rentalStatus === "Active" ? "Aktif" : "Pasif"}
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Tarih ve Fiyat Bilgileri
              </h3>
              <p>
                <strong>Kiralama Türü:</strong> {activeRental.rentalType}
              </p>
              <p>
                <strong>Başlangıç Tarihi:</strong>{" "}
                {formatDate(activeRental.startDate)}
              </p>
              <p>
                <strong>Bitiş Tarihi:</strong>{" "}
                {activeRental.endDate
                  ? formatDate(activeRental.endDate)
                  : "N/A"}
              </p>
              <p>
                <strong>Geçen Süre:</strong>{" "}
                {calculateRentalDuration(activeRental.startDate).hours} saat{" "}
                {calculateRentalDuration(activeRental.startDate).minutes} dakika
              </p>
              <p>
                <strong>Saatlik Fiyat:</strong> {activeRental.car.pricePerHour}{" "}
                TL
              </p>
              <p>
                <strong>Toplam Fiyat:</strong>{" "}
                {activeRental.rentalType === "Daily"
                  ? activeRental.totalPrice // Assuming totalPrice is available in the rental data
                  : calculateEstimatedPrice(
                      activeRental.car.pricePerHour,
                      calculateRentalDuration(activeRental.startDate)
                        .durationInMinutes
                    )}{" "}
                TL
              </p>

              {/* rentaltype 1 ise aşım süresi ve ücreti göster */}
              {activeRental &&
                activeRental.rentalType === "Daily" &&
                activeRental.endDate && (
                  <div>
                    <h4 className="mt-4 text-lg font-semibold">
                      Aşım Bilgileri
                    </h4>
                    {calculateOverdueFee(
                      activeRental.car.pricePerHour,
                      activeRental.endDate
                    ).overdueHours === 0 &&
                    calculateOverdueFee(
                      activeRental.car.pricePerHour,
                      activeRental.endDate
                    ).overdueMinutes === 0 ? (
                      <p>Henüz aşım bilgisi oluşmamıştır.</p>
                    ) : (
                      <>
                        <p>
                          <strong>Aşım Süresi:</strong>{" "}
                          {
                            calculateOverdueFee(
                              activeRental.car.pricePerHour,
                              activeRental.endDate
                            ).display
                          }
                        </p>
                        {calculateOverdueFee(
                          activeRental.car.pricePerHour,
                          activeRental.endDate
                        ).overdueFee > 0 ? (
                          <p>
                            <strong>Aşım Ücreti:</strong>{" "}
                            {
                              calculateOverdueFee(
                                activeRental.car.pricePerHour,
                                activeRental.endDate
                              ).overdueFee
                            }{" "}
                            TL
                          </p>
                        ) : (
                          <p>Henüz aşım ücreti oluşmamıştır.</p>
                        )}
                      </>
                    )}
                  </div>
                )}
            </div>

          </div>

          {isImageUploadVisible && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">İade için Aracın Fotoğraflarını Yükleyin</h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="border p-2 rounded"
              />
              <div className="mt-4">
                <p>Toplam {images.length} fotoğraf seçildi.</p>
              </div>
            </div>
          )}
          <div className="text-center mt-6">
          <button
            onClick={() => handleEndRental(activeRental.id)}
            disabled={isSubmitting}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Kiralamayı Sonlandır
          </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-700 text-xl">
          Aktif bir kiralama bulunamadı.
        </div>
      )}
    </div>
  );
}

export default ActiveRental;
