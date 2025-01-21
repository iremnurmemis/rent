"use client";
import { useUser } from "@/contexts/UserContext";
import {
  CreditCardDetail,
  CreditCardService,
} from "@/services/creditCardService";
import React, { useEffect, useState } from "react";
import { SiVisa } from "react-icons/si";
import { FiCircle, FiPlusCircle } from "react-icons/fi";
import { RentService, CarRental } from "@/services/rentService";
import { useRouter } from "next/navigation";
import { BalanceService, UserBalance } from "@/services/balanceService";
import { FaCoins } from "react-icons/fa";

function CreditCard() {
  const { user } = useUser();
  const router = useRouter();
  const carIdString = localStorage.getItem("selectedCarId");
  const carId = carIdString ? parseInt(carIdString, 10) : null;

  const totalRentalCostS = localStorage.getItem("totalRentalCost");
  const totalRentalCost = totalRentalCostS
    ? parseInt(totalRentalCostS, 10)
    : null;

  const storedRentalType = localStorage.getItem("rentalType");
  const rentaltype = storedRentalType ? parseInt(storedRentalType, 10) : null;

  const storedDurationInDays = localStorage.getItem("durationInDays");
  const durationday = storedDurationInDays
    ? parseInt(storedDurationInDays, 10)
    : null;

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

  const [userBalance, setUserBalance] = useState<undefined | number>(undefined);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [remainingTotalPrice, setRemainingTotalPrice] = useState<number>(0);
  const [balanceUsed, setBalanceUsed] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const response = await BalanceService.getUserBalance(user.id);
        setUserBalance(response?.balance ?? 0);
      } catch (error) {
        console.error("Error fetching user balance:", error);
        setUserBalance(0);
      }
    };

    if (user?.id) fetchUserBalance();
  }, [user?.id]);

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.length >= 4
      ? `*** *** *** ${cardNumber.slice(-4)}`
      : cardNumber;
  };

  const handleSelectCard = (card: CreditCardDetail) => {
    setSelectedCard(card);
    setShowCardForm(false);
    setIsUsingNewCard(false);

   
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
    console.log(durationday);
    console.log(rentaltype);
    console.log(carId);
    if (carId && rentaltype != null && durationday != null) {
      console.log("Tüm değerler geçerli, kiralama başlatılabilir.");
      if (selectedCard) {
        console.log("Mevcut kart kullanılıyor:", selectedCard);
        console.log("Seçilen araç ID'si:", carId);

        try {
          // Mevcut kartla kiralama API çağrısı
          const rental = await RentService.startRental(
            carId,
            user.id,
            selectedCard.id,
            rentaltype,
            rentaltype === 1 ? durationday : 0,
            balanceUsed
          );
          console.log("Kiralama işlemi başarılı:", rental);
          alert("Kiralama işlemi başarılı!");
          router.push("/active-rental");
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          console.log("Kiralama işlemi sırasında hata oluştu:", errorMessage);
          if (
            errorMessage ===
            "Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz"
          ) {
            alert(
              "Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz"
            );
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
              const rental = await RentService.startRental(
                carId,
                user.id,
                addedCard.data.id,
                rentaltype,
                rentaltype == 1 ? durationday : 0,
                balanceUsed
              );
              console.log("Kiralama işlemi başarılı:", rental);
              alert("Kiralama işlemi başarılı!");
              router.push("/active-rental");
            } catch (error: any) {
              const errorMessage =
                error.response?.data?.message || error.message;
              console.log(
                "Kiralama işlemi sırasında hata oluştu:",
                errorMessage
              );
              if (
                errorMessage ===
                "Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz"
              ) {
                alert(
                  "Kiralamaya başlamadan önce Sürücü belgenizi sisteme yüklemelisiniz"
                );
                router.push("/upload-driverlicence");
              } else {
                alert(`Hata: ${errorMessage}`);
                console.log("irem" + errorMessage)
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

   const handleBalanceUsage = () => {
    if (userBalance !== undefined && totalRentalCost !== null) {
      setIsButtonDisabled(true); // Butonu geçici olarak devre dışı bırak

      if (userBalance >= totalRentalCost) {
        setBalanceUsed(true);
        setRemainingBalance(userBalance - totalRentalCost);
        setRemainingTotalPrice(0);
        setUserBalance(userBalance - totalRentalCost);
      } else {
        setBalanceUsed(true);
        setRemainingBalance(0);
        setUserBalance(0);
        setRemainingTotalPrice(totalRentalCost - userBalance);
      }

    
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center border-2 rounded-lg border-gray-300 w-full max-w-2xl p-6 bg-white shadow-md">
        {userBalance === undefined ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : (
          <>
            {/* Display Total Rental Cost */}
            {totalRentalCost !== null && rentaltype === 1 && (
              <div className="mt-4">
                <p className="text-xl font-semibold text-gray-800 text-center">
                  Toplam Kiralama Ücreti {totalRentalCost} TL
                </p>
              </div>
            )}
            <p className="text-xl font-semibold text-gray-800 text-center">
              Ön Ödemeli Bakiyeniz {userBalance} TL
            </p>
           
            {rentaltype === 1 && (
             <div className="mt-4 w-[400px] flex flex-col items-center p-4 border rounded-lg shadow-sm bg-gray-50">
             <p className="text-gray-800 text-lg font-semibold text-center">
               Ön ödemeli bakiyenizi kullanmak ister misiniz?
             </p>
             <div className="mt-4 flex gap-4">
          <button
            onClick={handleBalanceUsage}
            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out 
             
            }`}
            disabled={isButtonDisabled}
          >
            Evet
          </button>
          <button
            onClick={() => {
              if (totalRentalCost !== null) {
                setBalanceUsed(false);
                setRemainingBalance(0);
                setRemainingTotalPrice(0);
                setUserBalance(totalRentalCost + remainingBalance);
              } else {
                console.error("Total rental cost is null.");
              }
            }}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 ease-in-out"
          >
            Hayır
          </button>
        </div>
           </div>
           
            )}

            {balanceUsed && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium   text-gray-800">
                  Kalan Ön Ödemeli Bakiye:{" "}
                  <span className="text-gray-800">{remainingBalance} TL</span>
                </p>
                <p className="text-lg font-medium  text-gray-800">
                  Kalan Kiralama Ücreti:{" "}
                  <span className="text-gray-800">{remainingTotalPrice} TL</span>
                </p>
              </div>
            )}

            {rentaltype === 0 && (
              <div className="mt-4 w-[400px] flex flex-col items-center">
                <p className="text-gray-600 text-sm ml-4">
                  Ödeme ilk olarak bakiye üzerinden yapılacaktır. Eğer bakiye
                  yetersizse, kalan miktar seçilen karttan tahsil edilecektir.
                </p>
              </div>
            )}
          </>
        )}

        <p className="text-xl font-semibold text-gray-800 mb-6 text-center mt-6">
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
