"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { BalancePackage, BalanceService } from "@/services/balanceService";
import { FaCoins } from "react-icons/fa";
import { useRouter } from "next/navigation";

function BalanceOperations() {
  const { user } = useUser();
  const [userBalance, setUserBalance] = useState<undefined | number>(undefined);
  const [balancePackages, setBalancePackages] = useState<
    undefined | BalancePackage[]
  >([]);
  const router = useRouter();

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

  useEffect(() => {
    const fetchBalancePackage = async () => {
      try {
        const response = await BalanceService.getBalancePackages();
        setBalancePackages(response);
      } catch (error) {
        console.error("Error fetching balance package:", error);
        setBalancePackages(undefined);
      }
    };

    fetchBalancePackage();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center border-2 rounded-lg border-gray-300 w-full max-w-2xl p-6 bg-white shadow-md">
        {userBalance === undefined ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : (
          <>
            <p className="text-xl font-semibold text-gray-800">
              Ön Ödemeli Bakiyen
            </p>
            <div className="flex items-center mt-2">
              <FaCoins className="text-yellow-500 text-3xl mr-2" />
              <span className="text-2xl font-bold text-gray-800">
                {userBalance} TL
              </span>
            </div>
            <p className="text-lg font-bold text-gray-800 mt-4">BAKİYE YÜKLE</p>

            <div className="w-full mt-4 space-y-4">
              {balancePackages?.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border rounded-lg p-4 flex justify-between items-center bg-gray-50 hover:bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-600">
                      {pkg.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {pkg.price.toLocaleString()} TL öde,{" "}
                      {pkg.creditAmount.toLocaleString()} TL kullan
                    </p>
                    <p className="text-sm text-red-500 line-through">
                      {pkg.creditAmount.toLocaleString()} TL
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {pkg.price} TL
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg shadow hover:bg-red-600 focus:outline-none"
                    onClick={() => {
                      router.push(`/load-balance?id=${pkg.id}`);
                    }}
                  >
                    Satın Al
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BalanceOperations;
