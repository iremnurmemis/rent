"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { adminLogin, login } from "@/services/authService";

function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const router = useRouter();
  const { login: setUser } = useUser();
  const { user } = useUser();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir email adresi girin.")
      .max(256, "Email adresi çok uzun.")
      .required("Email adresi gereklidir.")
      .test("not-tempmail", "Geçici email adresi kullanılamaz.", (value) => {
        const blockedDomains = [
          "tempmail.com",
          "mailinator.com",
          "yopmail.com",
        ];
        const domain = value.split("@")[1];
        return !blockedDomains.includes(domain);
      }),
    password: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalıdır.")
      .required("Şifre gereklidir."),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setBackendError("");
    try {
      const userData = await adminLogin(values.email, values.password);
      setUser(userData);
      alert("Giriş başarılı");
      console.log(user);

      router.push("/admin/dashboard");

      setTimeout(() => {
        values.email = "";
        values.password = "";
      }, 2000);
    } catch (error: any) {
      console.log(error);
      const backendMessage = error.message;

      console.log(backendMessage);
      if (backendMessage) {
        setBackendError(backendMessage); // Hata mesajını göster
      } else {
        setBackendError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-white flex items-center justify-center">
        <img
          src="/login1.jpg"
          alt="Car rental illustration"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="w-3/4 max-w-sm p-6 bg-white shadow-md rounded-lg">
              <h1 className="text-2xl font-bold mb-6 text-[#002E67] text-center">
                Giriş Yap
              </h1>
              <div className="flex flex-col gap-6">
                {/* Email Girişi */}
                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Email
                  </label>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-[10px]"
                  />
                </div>

                {/* Şifre Girişi */}
                <div className="relative">
                  <Field
                    type="password"
                    name="password"
                    className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-white border border-[#002E67] rounded-lg appearance-none focus:outline-none focus:ring-0 peer focus:border-[#002E67] focus:border-[3px]"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-base text-gray-700 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#002E67] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Şifre
                  </label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-[10px]"
                  />
                </div>

                {backendError && (
                  <div className="text-red-500 text-sm  mt-[10px]">
                    {backendError}
                  </div>
                )}

                {/* Gönder Butonu */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-[#002E67] text-white py-3 rounded-lg text-center hover:opacity-90"
                >
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </button>

                <div className="flex flex-col gap-1">
                  {" "}
                  {/* Adjust the gap value */}
                  <p className="text-center text-base text-gray-800">
                    Hesabınız yok mu?{" "}
                    <a
                      href="/signUp"
                      className="text-[#002E67] font-medium hover:underline"
                    >
                      Kaydol
                    </a>
                  </p>
                  {/* Şifremi Unuttum Bağlantısı */}
                  <div className="text-center">
                    <a
                      href="/forgot-password"
                      className="text-[#002E67] font-medium hover:underline"
                    >
                      Şifremi Unuttum
                    </a>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AdminLoginPage;
