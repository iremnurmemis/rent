"use client"; 
import { useState } from "react";
import React from "react";
import { signUp } from "@/services/authService";
import { useRouter } from "next/navigation";

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState("");

  const router = useRouter();
 

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Şifre, en az bir büyük harf, bir küçük harf, bir rakam ve 8 karakter uzunluğunda olmalıdır.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/; // 10 haneli telefon numarası formatı
    return phoneRegex.test(phoneNumber);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-ZşŞıİçÇğĞöÖüÜ]+$/; // Yalnızca harfler ve Türkçe karakterler
    return nameRegex.test(name);
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Geçersiz e-posta formatı");
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage("Geçersiz telefon numarası formatı");
      setLoading(false);
      return;
    }

    if (!validateName(firstName)) {
      setErrorMessage("First Name yalnızca harf içermelidir");
      setLoading(false);
      return;
    }

    if (!validateName(lastName)) {
      setErrorMessage("Last Name yalnızca harf içermelidir");
      setLoading(false);
      return;
    }

   

    try {
      const data = await signUp(email, password, firstName, lastName, phoneNumber);
      alert("Kayıt başarılı");
      router.push("/login");

      // 2 saniye sonra formu sıfırlama
      setTimeout(() => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
      }, 2000);
    } catch (error:any) {
      console.log(error);
      const backendMessage = error.message;

      console.log(backendMessage);
      if (backendMessage) {
        setBackendError(backendMessage);
      } else {
        setBackendError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sol taraf - Görsel */}
      <div className="flex-1 bg-white flex items-center justify-center">
        <img
          src="/login1.jpg"
          alt="Car rental illustration"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Sağ taraf - Form */}
      <div className="flex-1 flex items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className="w-3/4 max-w-sm p-6 bg-white shadow-md rounded-lg mt-[90px]"
        >
          <h1 className="text-2xl font-bold mb-6 text-[#002E67] text-center">
            Kaydol
          </h1>
          <div className="flex flex-col gap-6">
            {/* First Name */}
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
                First Name
              </label>
            </div>

            {/* Last Name */}
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
                Last Name
              </label>
            </div>

            {/* Email */}
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
                Email
              </label>
            </div>

            {/* Phone Number */}
            <div className="relative">
              <input
                type="text"
                id="phoneNumber"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                aria-label="Phone Number"
              />
              <label
                htmlFor="phoneNumber"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Phone Number
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <label
                htmlFor="password"
                className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Password
              </label>

              
              {backendError && (
                  <div className="text-red-500 text-sm mt-[10px]">
                    {backendError}
                  </div>
                )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-5 right-3 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Hata Mesajı */}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002E67] text-white py-3 rounded-lg text-center hover:opacity-90"
            >
              {loading ? "Kayıt Yapılıyor..." : "Kaydol"}
            </button>
            <p className="text-center text-base mt-4 text-gray-800">
              Hesabınız var mı?{" "}
              <a
                href="/login"
                className="text-[#002E67] font-medium hover:underline"
              >
                Giriş Yap
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
