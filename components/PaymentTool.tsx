"use client";
import { useUser } from "@/contexts/UserContext";
import {
  CreditCardDetail,
  CreditCardService,
} from "@/services/creditCardService";
import React, { useEffect, useState } from "react";
import { SiVisa } from "react-icons/si";
import { FiPlusCircle } from "react-icons/fi";
import { BsCreditCard2Front } from "react-icons/bs";

function PaymentTool() {
  const { user } = useUser();
  const [creditCards, setCreditCard] = useState<CreditCardDetail[]>([]);
  const [showCardForm, setShowCardForm] = useState(false);

  // Yeni kart bilgileri için state
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolderName, setNewCardHolderName] = useState("");
  const [newCardType, setNewCardType] = useState(1);
  const [newExpireMonth, setExpireMonth] = useState("");
  const [newExpireYear, setExpireYear] = useState("");
  const [newCVC, setNewCVC] = useState("");

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

  const validateNewCard = () => {
    // Validate if all fields are filled
    if (!newCardNumber || !newCardHolderName || !newExpireMonth || !newExpireYear || !newCVC) {
      alert("Lütfen tüm alanları doldurun.");
      return false;
    }
  
    // Validate card number: 16 digits, numeric
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(newCardNumber)) {
      alert("Kart numarası geçerli değil. 16 haneli bir sayı olmalı.");
      return false;
    }
  
    // Validate CVC: 3 digits, numeric
    const cvcRegex = /^\d{3}$/;
    if (!cvcRegex.test(newCVC)) {
      alert("CVC kodu rakamlardan oluşmalıdır.");
      return false;
    }
  
    // Validate card holder name: alphabetic characters only
    const cardHolderNameRegex = /^[A-Za-z\s]+$/;
    if (!cardHolderNameRegex.test(newCardHolderName)) {
      alert("Kart üzerindeki isim yalnızca harflerden oluşmalıdır.");
      return false;
    }
  
    return true;
  };
  
  

  const maskCardNumber = (cardNumber: string) =>
    cardNumber.length >= 4
      ? `**** **** **** ${cardNumber.slice(-4)}`
      : cardNumber;

      const addNewCard = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission to handle validation
      
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
            alert("Kart eklendi");
            console.log("Yeni kart kullanılıyor:", addedCard.data.cardHolderName);
      
            setCreditCard((prevState) => [...prevState, addedCard.data as CreditCardDetail]);


            // Close the card form
            setShowCardForm(false);
          } else {
            console.error("Kart eklenirken ID alınamadı:", addedCard);
          }
        } catch (error) {
          console.error("Kart eklenirken hata oluştu:", error);
          alert("Kart ekleme başarısız!");
        }
      };
      

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-6">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Ödeme Araçlarım
        </h1>

        {/* Kart Listesi veya Boş Durum */}
        {creditCards.length > 0 ? (
          creditCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                {card.cardType === 1 ? (
                  <SiVisa size={36} className="text-blue-600" />
                ) : (
                  <img
                    src="/mastercard.png"
                    alt="Mastercard"
                    className="h-10"
                  />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {maskCardNumber(card.cardNumber)}
                  </p>
                  <p className="text-sm text-gray-500">{card.cardHolderName}</p>
                </div>
              </div>
              <BsCreditCard2Front size={24} className="text-gray-400" />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mb-6">
            Henüz eklenmiş bir ödeme aracınız yok.
          </p>
        )}

        {/* Kart Ekle Butonu */}
        <button
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-blue-600 transition-colors"
          onClick={() => setShowCardForm(true)}
        >
          <FiPlusCircle size={20} />
          {creditCards.length > 0
            ? "Başka Bir Kart Ekle"
            : "Banka kartı/kredi kartı ekle"}
        </button>

        {/* Yeni Kart Formu */}
        {showCardForm && (
          <form className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Yeni Kart Ekle
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Kart Numarası */}
              <input
                type="text"
                placeholder="Kart Numarası"
                value={newCardNumber}
                onChange={(e) => setNewCardNumber(e.target.value)}
                className="p-3 rounded-lg border border-gray-300"
              />

              {/* Expire Month, Year, and CVC */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newExpireMonth}
                  onChange={(e) => setExpireMonth(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  value={newExpireYear}
                  onChange={(e) => setExpireYear(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300"
                >
                  {Array.from(
                    { length: 21 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="CVC"
                  maxLength={3}
                  value={newCVC}
                  onChange={(e) => setNewCVC(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300"
                />
              </div>

              {/* Kart Üzerindeki İsim ve Kart Tipi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Kart Üzerindeki İsim"
                  value={newCardHolderName}
                  onChange={(e) => setNewCardHolderName(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300"
                />

                <select
                  value={newCardType}
                  onChange={(e) => setNewCardType(Number(e.target.value))}
                  className="p-3 rounded-lg border border-gray-300"
                >
                  <option value={1}>Visa</option>
                  <option value={2}>Mastercard</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                onClick={addNewCard}
                className="mt-4 w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
              >
                Kaydet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentTool;
