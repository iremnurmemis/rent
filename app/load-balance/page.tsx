"use client"
import { useUser } from "@/contexts/UserContext";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BalanceService, BalancePackage } from '@/services/balanceService';
import { CreditCardDetail, CreditCardService } from "@/services/creditCardService";
import { SiVisa } from "react-icons/si";
import { FiCircle, FiPlusCircle } from "react-icons/fi";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

function LoadBalancePage() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [selectedPackage, setSelectedPackage] = useState<BalancePackage | null>(null);

    const [creditCards, setCreditCard] = useState<CreditCardDetail[]>([]);
    const [selectedCard, setSelectedCard] = useState<CreditCardDetail | null>(null);
    const [showCardForm, setShowCardForm] = useState(false);
    const [isUsingNewCard, setIsUsingNewCard] = useState(false);

    const [newCardNumber, setNewCardNumber] = useState("");
    const [newCardHolderName, setNewCardHolderName] = useState("");
    const [newCardType, setNewCardType] = useState(1); // 1 for Visa, 2 for Mastercard
    const [newExpireMonth, setExpireMonth] = useState(""); // Expiry Month
    const [newExpireYear, setExpireYear] = useState(""); // Expiry Year
    const [newCVC, setNewCVC] = useState(""); // CVC Code

    const router = useRouter(); // Hook to navigate

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
        if (id) {
            const fetchPackage = async () => {
                try {
                    const packageData = await BalanceService.getBalancePackageById(Number(id));
                    if (packageData && packageData.id) {
                        setSelectedPackage(packageData);
                    } else {
                        console.error("Package data is empty or invalid", packageData);
                    }
                } catch (error) {
                    console.error('Error fetching balance package:', error);
                }
            };
            fetchPackage();
        }
    }, [id]);

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

    const handleLoadBalance = async () => {
        if (!selectedCard || !selectedPackage) {
            alert('Lütfen geçerli bir kart ve paket seçin.');
            return;
        }

        console.log('Selected Card:', selectedCard);
        console.log('Selected Package:', selectedPackage);

        const loadBalanceData = {
            userId: user.id,
            cardId: selectedCard.id,
            packageId: selectedPackage.id,
        };

        try {
            const response = await BalanceService.LoadBalance(loadBalanceData);
            console.log('Bakiye başarıyla yüklendi:', response);

            alert('Bakiye başarıyla yüklendi');
            setTimeout(() => {
                router.push('/balance');
            }, 500);
        } catch (error) {
            console.log('Bakiye yüklenirken bir hata oluştu:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex flex-col items-center justify-center border-2 rounded-lg border-gray-300 w-full max-w-2xl p-6 bg-white shadow-md">
                
                {selectedPackage && (
                    <div className="text-center mb-6">
                        <p className="text-2xl font-semibold text-gray-800">{selectedPackage.name} {selectedPackage.price}₺</p>
                        <p className="text-sm text-gray-500 mt-2">Hemen ödeme yaparak bu paketi satın alabilirsiniz.</p>
                    </div>
                )}

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
                                className={`w-5 h-5 rounded-full border-2 ${selectedCard === card ? "bg-blue-500" : "bg-white"} mr-4 cursor-pointer flex items-center justify-center`}
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
                        onClick={handleLoadBalance}
                    >
                        BAKİYE YÜKLE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoadBalancePage;
