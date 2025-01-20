"use client";
import { useUser } from "@/contexts/UserContext";
import React, { useState } from "react";
import { ContactUsService } from "@/services/contactUsService";

function ContactUs() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [contactText, setMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useUser();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/; // 10 haneli telefon numarası formatı
    return phoneRegex.test(phoneNumber);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-ZşŞıİçÇğĞöÖüÜ]+$/; // Yalnızca harfler ve Türkçe karakterler
    return nameRegex.test(name);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !firstName || !lastName || !phone || !contactText) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Geçersiz e-posta formatı");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setErrorMessage("Geçersiz telefon numarası formatı");
      return;
    }

    if (!validateName(firstName)) {
      setErrorMessage("İsim yalnızca harf içermelidir");
      return;
    }

    if (!validateName(lastName)) {
      setErrorMessage("Soyadı yalnızca harf içermelidir");
      return;
    }

    try {
      const data = ContactUsService.addContactForm({
        userId: user.id,
        firstName,
        lastName,
        email,
        phone,
        contactText,
      });
      // Uzun süreli başarılı mesaj göstermek
      const alertBox = document.createElement("div");
      alertBox.textContent =
        "Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapılacaktır.";
      alertBox.style.position = "fixed";
      alertBox.style.top = "20px";
      alertBox.style.right = "20px";
      alertBox.style.left = "50%"; // Ortada konumlandırma
      alertBox.style.transform = "translateX(-50%)";
      alertBox.style.backgroundColor = "#4caf50";
      alertBox.style.color = "white";
      alertBox.style.padding = "15px";
      alertBox.style.borderRadius = "5px";
      alertBox.style.zIndex = "1000";
      alertBox.style.textAlign = "center";
      document.body.appendChild(alertBox);

      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 5000);

      // Formu sıfırla
      setTimeout(() => {
        document.body.removeChild(alertBox);
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-white flex items-center justify-center ">
        <img
          src="/contactUs.jpg"
          alt="Car rental illustration"
          className="max-w-full max-h-full object-contain mt-16 ml-[64px] "
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-3/4 max-w-sm p-6 bg-white shadow-md rounded-lg mt-[90px] mr-[64px]"
        >
          <h1 className="text-2xl font-bold mb-6 text-[#002E67] text-center">
            İletişim Formu
          </h1>
          <div className="flex flex-col gap-6">
            <div className="relative">
              <input
                type="text"
                id="firstName"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-label="First Name"
              />
              <label
                htmlFor="firstName"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                İsim
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-label="Last Name"
              />
              <label
                htmlFor="lastName"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Soyisim
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
              <label
                htmlFor="email"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                E-posta
              </label>
            </div>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                aria-label="Phone Number"
              />
              <label
                htmlFor="phoneNumber"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Telefon Numarası
              </label>
            </div>
            <div className="relative">
              <textarea
                id="message"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={contactText}
                onChange={(e) => setMessage(e.target.value)}
                required
                aria-label="Message"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Mesajınız
              </label>
            </div>
            {/* Hata Mesajı */}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <button
              type="submit"
              className="w-full bg-[#002E67] text-white py-3 rounded-lg text-center hover:opacity-90"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
