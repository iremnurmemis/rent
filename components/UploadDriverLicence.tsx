"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { UploadDriverLicenceService } from "@/services/uploadDriverLicenceService";
import { useRouter } from "next/navigation";

function UploadDriverLicence() {
  const { user } = useUser();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success" | null;
  }>({ text: "", type: null });

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!user) {
      setMessage({ text: "Kullanıcı bilgisi bulunamadı.", type: "error" });
      return;
    }

    if (!file) {
      setMessage({ text: "Lütfen bir dosya seçin.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(user.id));

    try {
      const response = await UploadDriverLicenceService.uploadDriverLicence(file, user.id);

      if (response) {
        setMessage({ text: response, type: "success" });
        // Mesajı gösterdikten sonra yönlendirme işlemi yapılacak
        setTimeout(() => {
          router.push("/cars");
        }, 3000); // Mesajın 3 saniye gösterilmesini sağlıyoruz
      } else {
        setMessage({ text: "Bilinmeyen bir hata oluştu.", type: "error" });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data;
      setMessage({ text: errorMessage || "Bir hata oluştu", type: "error" });
    }
  };

  useEffect(() => {
    if (message.text && message.type) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: null });
      }, 7000); // 7 saniye sonra mesajı temizle
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 bg-white shadow-xl rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ehliyet Belgenizi Yükleyin</h2>
        <p className="text-center text-gray-600 mb-6">
          Lütfen geçerli sürücü belgenizi yükleyin. Bu işlem, kiralama işleminiz için gereklidir.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#002E67] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Dosyayı Yükle
          </button>
        </form>

        {/* Success or error message */}
        {message.text && (
          <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ zIndex: 9999 }}
          >
            <p className="text-white font-semibold text-lg">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadDriverLicence;

