"use client";
import { useUser } from "@/contexts/UserContext";
import {
  CreditCardDetail,
  CreditCardService,
} from "@/services/creditCardService";
import React, { useEffect, useState } from "react";
import { SiVisa, SiMastercard } from "react-icons/si";
import { FiCircle, FiPlusCircle } from "react-icons/fi";

function CreditCard() {
  const { user } = useUser();
  const [creditCards, setCreditCard] = useState<CreditCardDetail[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCardDetail | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [isUsingNewCard, setIsUsingNewCard] = useState(false);

  // New card form data state
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolderName, setNewCardHolderName] = useState("");
  const [newCardType, setNewCardType] = useState(1); // 1 for Visa, 2 for Mastercard
  const [newexpireMonth, setExpireMonth] = useState(""); // Expiry Month
  const [newexpireYear, setExpireYear] = useState(""); // Expiry Year


  useEffect(() => {
    const fetchCreditCardDetail = async () => {
      try {
        const response = await CreditCardService.getUserCards(user.id);
        setCreditCard(response);
        console.log(response);
      } catch (error) {
        console.error("Kart bilgileri gelirken hata oluştu:", error);
      }
    };

    if (user?.id) {
      fetchCreditCardDetail();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedCard) {
      console.log("Selected Card:", selectedCard);
    }
  }, [selectedCard]);

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
    if (!newCardNumber || !newCardHolderName) {
      alert("Lütfen tüm alanları doldurun.");
      return false;
    }
    if (newCardNumber.length < 16) {
      alert("Kart numarası geçerli değil.");
      return false;
    }
    return true;
  };

  const handleRentStart = async () => {
    if (selectedCard) {
      console.log("Mevcut kart kullanılıyor:", selectedCard);
      // API isteği ile kiralama işlemi yapılabilir SELECTEDCARD ID Yİ GÖNDER
    } else if (showCardForm) {
      if (!validateNewCard()) return;
  
      try {
        const newCard = {
          cardNumber: newCardNumber,
          cardHolderName: newCardHolderName,
          cardType: newCardType,
          userId: user.id,
          expireMonth: newexpireMonth,
          expireYear: newexpireYear,
        };
  
        // API isteğini yaparken response'u kontrol et
        const addedCard = await CreditCardService.addCreditCard(newCard);
  
        if (addedCard && addedCard.data && addedCard.data.id) {
          console.log("Yeni kart kullanılıyor:", addedCard.data.id);
        } else {
          console.error("Kart eklenirken id alınamadı:", addedCard);
        }
      } catch (error) {
        console.error("Kart eklenirken hata oluştu:", error);
      }
    } else {
      alert("Lütfen bir kart seçin veya yeni bir kart ekleyin.");
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center justify-center border-2 rounded-lg border-black-400 w-full max-w-md p-6">
        <p className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Ödeme Yapmak İstediğiniz Kartı Seçiniz
        </p>

        {creditCards.map((card, index) =>
          card.cardHolderName && card.cardNumber ? (
            <div
              key={index}
              className="flex flex-row items-center mb-4 w-[300px] p-4 border-2 rounded-lg border-gray-400 shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
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
              <div className="flex justify-center items-center mb-4 md:mb-0 md:w-1/3">
                {card.cardType === 1 && <SiVisa size={50} color="blue" />}
                {card.cardType === 2 && (
                  <img src="/mastercard.png" alt="Mastercard" width="60" />
                )}
              </div>
              <div className="flex flex-col items-center md:items-start md:ml-4 w-full">
                <p className="text-center md:text-left font-semibold text-lg text-gray-700">
                  {maskCardNumber(card.cardNumber)}
                </p>
                <p className="text-center md:text-left text-sm text-gray-600">
                  {card.cardHolderName}
                </p>
              </div>
            </div>
          ) : null
        )}

        <div className="mt-4 w-full flex justify-center">
          <button
            className="w-[300px] p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 ease-in-out flex items-center justify-center"
            onClick={handleShowCard}
          >
            <FiPlusCircle size={20} color="white" className="mr-5" />
            Başka Bir Kart Kullan
          </button>
        </div>

        {showCardForm && (
          <div className="mt-4 w-full flex flex-col items-center justify-center border-2 rounded-lg border-black-400 p-6">
            <div>
              <input
                type="text"
                placeholder="Kart Numarası"
                value={newCardNumber}
                onChange={(e) => setNewCardNumber(e.target.value)}
                className="mb-4 p-2 w-[280px] border-2 rounded-lg"
              />
            </div>

            <div className="flex mb-4 w-full gap-5">
              <select
                className="p-2 w-[80px] border-2 rounded-lg ml-8"
                value={newexpireMonth}
                onChange={(e) => setExpireMonth(e.target.value)}
              >
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {String(index + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                className="p-2 w-[80px] border-2 rounded-lg"
                value={newexpireYear}
                onChange={(e) => setExpireYear(e.target.value)}
              >
                {Array.from({ length: 21 }, (_, index) => new Date().getFullYear() + index).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="CVC"
                className="p-2 w-[80px] border-2 rounded-lg"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Kart Üzerindeki İsim"
                value={newCardHolderName}
                onChange={(e) => setNewCardHolderName(e.target.value)}
                className="mb-4 p-2 w-[280px] border-2 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <select
                value={newCardType}
                onChange={(e) => setNewCardType(Number(e.target.value))}
                className="p-2 w-[280px] border-2 rounded-lg"
              >
                <option value={1}>Visa</option>
                <option value={2}>Mastercard</option>
              </select>
            </div>
          </div>
        )}

        {/* Kiralamaya Başla Butonu */}
        <div className="mt-4 w-full flex justify-center">
          <button
            className="w-[300px] p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 ease-in-out"
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
