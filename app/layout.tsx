"use client";

import localFont from "next/font/local";
import "./globals.css";
import UserNavbar from "@/components/Navbar";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/SideBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <Content>{children}</Content>
        </UserProvider>
      </body>
    </html>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser(); // `loading` state'ini UserContext'ten çekiyoruz
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname.startsWith("/admin")) {
        router.push("/");
      } else if (user && user.operationClaimId !== 2 && pathname.startsWith("/admin")) {
        router.push("/");
      }
      setIsChecking(false);
    }
  }, [user, pathname, router, loading]);

  if (loading || isChecking) {
    return null; // Kullanıcı yüklenene kadar hiçbir şey göstermiyoruz
  }

  let NavbarComponent;
  if (user?.operationClaimId === 2) {
    NavbarComponent = <Sidebar />;
  } else {
    NavbarComponent = <UserNavbar />;
  }

  return (
    <>
      {NavbarComponent}
      {children}
    </>
  );
}


// "use client";

// import localFont from "next/font/local";
// import "./globals.css";
// import UserNavbar from "@/components/Navbar";
// import { UserProvider, useUser } from "@/contexts/UserContext";
// import Sidebar from "@/components/admin/SideBar";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user } = useUser();
  
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <UserProvider>
//           <Content>{children}</Content>
//         </UserProvider>
//       </body>
//     </html>
//   );
// }

// function Content({ children }: { children: React.ReactNode }) {
//   const { user } = useUser();

//   let NavbarComponent;
//   if (user?.operationClaimId === 2) {
//     NavbarComponent = <Sidebar />;
//   } else {
//     NavbarComponent = <UserNavbar />;
//   }

//   return (
//     <>
//       {NavbarComponent}
//       {children}
//     </>
//   );
// }