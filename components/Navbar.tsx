'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

function Navbar() {


  const router = useRouter();
  const { user, logout } = useUser();

  // const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

  // if (isLoginPage) return null;

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signUp");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between p-1 border-white border-b bg-white z-50 shadow-md">
      <Image
        src="/logo3.png"
        alt="logo"
        width={100}
        height={100}
        className="ml-0 object-contain h-[100px] w-[150px] scale-200"
      ></Image>
      <div className="flex gap-5">
        <Link href="/">
          <h2 className="hover:bg-[#002e67] px-3 cursor-pointer p-2 rounded-full hover:text-white font-semibold text-[#002e67] text-lg">
            Home
          </h2>
        </Link>

        <Link href="/cars">
          <h2 className="hover:bg-[#002e67] px-3 cursor-pointer p-2 rounded-full hover:text-white font-semibold text-[#002e67] text-lg">
            Cars
          </h2>
        </Link>
        <Link href="/rents">
          <h2 className="hover:bg-[#002e67] px-3 cursor-pointer p-2 rounded-full hover:text-white font-semibold text-[#002e67] text-lg">
            Rents
          </h2>
        </Link>
        <Link href="/contactUs">
          <h2 className="hover:bg-[#002e67] px-3 cursor-pointer p-2 rounded-full hover:text-white font-semibold text-[#002e67] text-lg">
            ContactUs
          </h2>
        </Link>
      </div>
      <div className="mr-[30px] flex font-semibold gap-5 text-[#002e67]">
        {user ? (
          <div className="relative group flex items-center">
            <div className="flex items-center justify-center w-11 h-11 bg-[#002e67] text-white rounded-full cursor-pointer">
              <span className="material-icons text-xl">person</span>
            </div>
            <div
              className="absolute right-0 hidden bg-white border rounded-md shadow-lg w-40 group-hover:block"
              style={{ top: "50px" }}
            >
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href="/profile">Profile</Link>
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <button
              className="px-4 py-2 bg-[#002e67] text-white rounded-full hover:bg-[#00449e]"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button
              className="px-4 py-2 bg-[#002e67] text-white rounded-full hover:bg-[#00449e]"
              onClick={handleSignUpClick}
            >
              SignUp
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;

