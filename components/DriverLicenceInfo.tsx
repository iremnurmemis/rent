"use client";

import { useUser } from "@/contexts/UserContext";
import React, { useEffect, useState } from "react";
import {
  UploadDriverLicenceService,
  DriverLicenceInfo as DriverLicenceInfoType,
} from "@/services/uploadDriverLicenceService";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";

function DriverLicenceInfo() {
  const [licenceInfo, setLicenceInfo] = useState<DriverLicenceInfoType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchDriverLicence = async () => {
      try {
        setLoading(true);
        const data = await UploadDriverLicenceService.getUserDriverLicence(user.id);
        if (data) {
          setLicenceInfo(data);
        } else {
          setLicenceInfo(null);
        }
      } catch (err) {
        setError("Ehliyet bilgileri alınırken bir hata oluştu.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverLicence();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="flex flex-col items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
          <p className="text-gray-600 text-xl font-medium mt-4">Veriler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center text-red-500">
          <FiAlertCircle className="text-4xl mb-2" />
          <h1 className="text-2xl font-bold">Hata!</h1>
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!licenceInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50">
        <div className="text-center text-gray-600">
          <h1 className="text-2xl font-bold">Sürücü Belgeniz Eksik</h1>
          <p>Lütfen sisteme sürücü belgenizi yükleyin.</p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={() => router.push("/upload-driverlicence")}
          >
            Ehliyet Yükle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ehliyet Bilgileriniz</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">Ehliyet Numarası:</span> {licenceInfo.licenceNo}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Alış Tarihi:</span>{" "}
              {new Date(licenceInfo.validUntil).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Yükleme Tarihi:</span>{" "}
              {new Date(licenceInfo.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverLicenceInfo;