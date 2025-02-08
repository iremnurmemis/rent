"use client"
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { changePassword } from "@/services/authService";

const ProfilePage = () => {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <div className="text-center text-red-500">Giriş yapmalısınız.</div>;
  }

  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      const response = await changePassword(user.email, currentPassword, newPassword);
      setMessage("Şifre başarıyla güncellendi");
      setError("");

      // 2 saniye sonra formu sıfırla
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      }, 1000);

    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Bir hata oluştu.");
      } else {
        setError("Mevcut şifre yanlış.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md m-[140px]">
      <h1 className="text-2xl font-bold mb-2 text-center">Hesap</h1>
      <p className="mb-4 text-center">Hesap ayarlarınızı düzenleme ve şifre değiştirme işlemlerinizi buradan yapabilirsiniz.</p>

      <h2 className="text-lg font-semibold mb-1">E-posta:</h2>
      <p className="mb-4">E-posta adresiniz: <strong>{user.email}</strong></p>

      <h2 className="text-lg font-semibold mb-1">Şifre:</h2>
      <form onSubmit={handlePasswordChange} className="space-y-3">
        <input
          type="password"
          placeholder="Mevcut şifreyi girin"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Yeni şifreyi tekrar girin"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
        >
          Şifreyi Değiştir
        </button>
      </form>
      {message && <p className="mt-2 text-center text-green-500">{message}</p>}
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}
    </div>
  );
};

export default ProfilePage;
