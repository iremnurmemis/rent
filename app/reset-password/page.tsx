
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "@/services/authService"; // API'ye bağlanacak servis

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState(""); // Bilgilendirme mesajı
  const router = useRouter();

  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalıdır.")
      .required("Yeni şifre gereklidir."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), undefined], "Şifreler uyuşmuyor.") 
      .required("Şifre doğrulaması gereklidir."),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setMessage("");
    setError("");
    setInfoMessage(""); // Önceki mesajları sıfırla
    try {
      const response = await resetPassword(email, token, values.newPassword);
      setMessage(response.message);
      setInfoMessage("Şifreniz başarıyla yenilendi! Giriş yapabilirsiniz."); // Bilgilendirme mesajı
      setTimeout(() => {
        router.push("/login"); // Başarılı işlem sonrası giriş sayfasına yönlendir
      }, 2500);
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg mx-auto mt-[200px]">
      <h1 className="text-2xl font-bold mb-6 text-[#002E67] text-center">Şifrenizi Yenileyin</h1>
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="relative mb-4">
              <Field
                type="password"
                name="newPassword"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg"
                placeholder="Yeni Şifre"
                required
              />
              <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="relative mb-4">
              <Field
                type="password"
                name="confirmPassword"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg"
                placeholder="Şifreyi Doğrula"
                required
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-[#002E67] text-white py-3 rounded-lg text-center"
            >
              {loading ? "Yükleniyor..." : "Şifreyi Yenile"}
            </button>

            {message && <div className="text-green-500 mt-4">{message}</div>}
            {infoMessage && <div className="text-green-500  mt-4">{infoMessage}</div>} {/* Bilgilendirme mesajı */}
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ResetPasswordPage;
