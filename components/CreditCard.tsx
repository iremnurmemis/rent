"use client";
import { useUser } from "@/contexts/UserContext";
import {
  CreditCardDetail,
  CreditCardService,
} from "@/services/creditCardService";
import React, { useEffect, useState } from "react";
import { SiVisa } from "react-icons/si";
import { FiCircle, FiPlusCircle } from "react-icons/fi";
import { RentService,CarRental } from "@/services/rentService";
import { useRouter } from "next/navigation";


function CreditCard() {
  const { user } = useUser();
  const router=useRouter();
  const carIdString = localStorage.getItem('selectedCarId');
  const carId = carIdString ? parseInt(carIdString, 10) : null;

  const [creditCards, setCreditCard] = useState<CreditCardDetail[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCardDetail | null>(
    null
  );
  const [showCardForm, setShowCardForm] = useState(false);
  const [isUsingNewCard, setIsUsingNewCard] = useState(false);

  // New card form data state
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolderName, setNewCardHolderName] = useState("");
  const [newCardType, setNewCardType] = useState(1); // 1 for Visa, 2 for Mastercard
  const [newExpireMonth, setExpireMonth] = useState(""); // Expiry Month
  const [newExpireYear, setExpireYear] = useState(""); // Expiry Year
  const [newCVC, setNewCVC] = useState(""); // CVC Code

   const [activeRental, setActiveRental] = useState<null | CarRental>(null);

  useEffect(() => {
    const fetchCreditCardDetail = async () => {
      try {
        const response = await CreditCardService.getUserCards(user.id);
        setCreditCard(response);
      } catch (error) {
        console.error("Kart bilgileri gelirken hata oluştu:", error);
      }
    };

    if (user?.id) {
      fetchCreditCardDetail();
    }
  }, [user?.id]);

  useEffect(() => {
      const fetchActiveRental = async () => {
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

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.length >= 4
      ? `*** *** *** ${cardNumber.slice(-4)}`
      : cardNumber;
  };

  const handleSelectCard = (card: CreditCardDetail) => {
    setSelectedCard(card);
    setShowCardForm(false);
    setIsUsingNewCard(false);

    if (activeRental) {
      // Eğer aktif kiralama varsa, cardId'yi güncelle
      updateActiveRentalCardId(card.id,activeRental.id);
    }

  };



  const updateActiveRentalCardId = async (cardId: number,rentalId:number) => {
    try {
      const updatedRental = await RentService.updateRentalCardId(cardId,rentalId);
      setActiveRental(updatedRental); 
      console.log("Aktif kiralama kart ID'si güncellendi:", updatedRental);
      router.push('/active-rental')
    } catch (error) {
      console.error("Kart ID'si güncellenirken hata oluştu:", error);
    }
  };


  const handleShowCard = () => {
    setSelectedCard(null);
    setShowCardForm(true);
    setIsUsingNewCard(true);
  };

  const validateNewCard = () => {
    if (!newCardNumber || !newCardHolderName || !newCVC) {
      alert("Lütfen tüm alanları doldurun.");
      return false;
    }
    if (newCardNumber.length < 16) {
      alert("Kart numarası geçerli değil.");
      return false;
    }
    if (newCVC.length !== 3) {
      alert("CVC kodu 3 haneli olmalıdır.");
      return false;
    }
    return true;
  };

  const handleRentStart = async () => {
    if (carId) {
      if (selectedCard) {
        console.log("Mevcut kart kullanılıyor:", selectedCard);
        console.log("Seçilen araç ID'si:", carId);
  
        try {
          // Mevcut kartla kiralama API çağrısı
          const rental = await RentService.startRental(carId, user.id, selectedCard.id);
          console.log("Kiralama işlemi başarılı:", rental);
          alert("Kiralama işlemi başarılı!");
          router.push("/active-rental");
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          console.log("Kiralama işlemi sırasında hata oluştu:", errorMessage);
          if (errorMessage === 'Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz') {
            alert("Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz");
            router.push("/upload-driverlicence");
          } else {
            alert(`Hata: ${errorMessage}`); // Diğer hatalar
          }
        }
      } else if (showCardForm) {
        if (!validateNewCard()) return;
  
        try {
          const newCard = {
            cardNumber: newCardNumber,
            cardHolderName: newCardHolderName,
            cardType: newCardType,
            userId: user.id,
            expireMonth: newExpireMonth,
            expireYear: newExpireYear,
            cvc: newCVC,
          };
  
          const addedCard = await CreditCardService.addCreditCard(newCard);
  
          if (addedCard && addedCard.data && addedCard.data.id) {
            console.log("Yeni kart kullanılıyor:", addedCard.data.id);
  
            try {
              // Yeni kartla kiralama API çağrısı
              const rental = await RentService.startRental(carId, user.id, addedCard.data.id);
              console.log("Kiralama işlemi başarılı:", rental);
              alert("Kiralama işlemi başarılı!");
              router.push("/active-rental");
            } catch (error: any) {
              const errorMessage = error.response?.data?.message || error.message;
              console.log("Kiralama işlemi sırasında hata oluştu:", errorMessage);
              if (errorMessage === 'Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz') {
                alert("Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz");
                router.push("/upload-driverlicence");
              } else {
                alert(`Hata: ${errorMessage}`); // Diğer hatalar
              }
            }
          } else {
            console.error("Kart eklenirken ID alınamadı:", addedCard);
            alert("Kart ekleme başarısız!");
          }
        } catch (error) {
          console.error("Kart eklenirken hata oluştu:", error);
          alert("Kart ekleme başarısız!");
        }
      } else {
        alert("Lütfen bir kart seçin veya yeni bir kart ekleyin.");
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center border-2 rounded-lg border-gray-300 w-full max-w-2xl p-6 bg-white shadow-md">
        <p className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Ödeme Yapmak İstediğiniz Kartı Seçiniz
        </p>

        {creditCards.map((card, index) =>
          card.cardHolderName && card.cardNumber ? (
            <div
              key={index}
              className="flex flex-row items-center mb-4 w-full max-w-sm p-4 border-2 rounded-lg border-gray-400 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div
                onClick={() => handleSelectCard(card)}
                className={`w-5 h-5 rounded-full border-2 ${
                  selectedCard === card ? "bg-blue-500" : "bg-white"
                } mr-4 cursor-pointer flex items-center justify-center`}
              >
                {selectedCard === card ? (
                  <FiCircle size={20} color="white" />
                ) : (
                  <FiCircle size={20} color="gray" />
                )}
              </div>
              <div className="flex justify-center items-center mb-4 md:mb-0 w-1/4">
                {card.cardType === 1 && <SiVisa size={40} color="blue" />}
                {card.cardType === 2 && (
                  <img src="/mastercard.png" alt="Mastercard" width="40" />
                )}
              </div>
              <div className="flex flex-col items-start w-3/4">
                <p className="font-semibold text-lg text-gray-700">
                  {maskCardNumber(card.cardNumber)}
                </p>
                <p className="text-sm text-gray-600">{card.cardHolderName}</p>
              </div>
            </div>
          ) : null
        )}

        <div className="mt-4 w-full flex justify-center">
          <button
            className="w-full max-w-sm p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 ease-in-out flex items-center justify-center"
            onClick={handleShowCard}
          >
            <FiPlusCircle size={20} color="white" className="mr-2" />
            Başka Bir Kart Kullan
          </button>
        </div>

        {showCardForm && (
          <div className="mt-4 w-full max-w-md flex flex-col items-center justify-center border-2 rounded-lg border-gray-300 p-6 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Kart Numarası"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
              className="mb-4 p-2 w-full border-2 rounded-lg"
            />
            <div className="flex mb-4 gap-4 w-full">
              <select
                className="p-2 flex-1 border-2 rounded-lg"
                value={newExpireMonth}
                onChange={(e) => setExpireMonth(e.target.value)}
              >
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {String(index + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                className="p-2 flex-1 border-2 rounded-lg"
                value={newExpireYear}
                onChange={(e) => setExpireYear(e.target.value)}
              >
                {Array.from(
                  { length: 21 },
                  (_, index) => new Date().getFullYear() + index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="CVC"
                value={newCVC}
                onChange={(e) => setNewCVC(e.target.value)}
                maxLength={3}
                className="p-2 w-1/3 border-2 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Kart Üzerindeki İsim"
              value={newCardHolderName}
              onChange={(e) => setNewCardHolderName(e.target.value)}
              className="mb-4 p-2 w-full border-2 rounded-lg"
            />
            <select
              className="mb-4 p-2 w-full border-2 rounded-lg"
              value={newCardType}
              onChange={(e) => setNewCardType(Number(e.target.value))}
            >
              <option value={1}>Visa</option>
              <option value={2}>Mastercard</option>
            </select>
          </div>
        )}

        <div className="mt-4 w-full flex justify-center">
          <button
            className="w-full max-w-sm p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 ease-in-out"
            onClick={handleRentStart}
          >
            Kiralamaya Başla
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreditCard;
