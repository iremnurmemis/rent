"use client"; // Bu satır, Next.js 13 ve sonrasında client-side rendering için gereklidir.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { requestPasswordReset } from "@/services/authService";

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir email adresi girin.")
      .required("Email adresi gereklidir."),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await requestPasswordReset(values.email);
      setMessage("Şifrenizi sıfırlamak için e-posta adresinize bir link gönderdik.");
      setTimeout(() => {
        router.push("/login"); 
      }, 4000);
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg mx-auto mt-[200px]">
      <h1 className="text-2xl font-bold mb-6 text-[#002E67] text-center">Şifremi Unuttum</h1>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="relative mb-4">
              <Field
                type="email"
                name="email"
                className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg"
                placeholder="E-posta adresinizi girin"
                required
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-[#002E67] text-white py-3 rounded-lg text-center"
            >
              {loading ? "Yükleniyor..." : "Şifre Sıfırlama Linkini Gönder"}
            </button>

            {message && <div className="text-green-500 mt-4">{message}</div>}
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPasswordPage;
