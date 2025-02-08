import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RxDashboard } from "react-icons/rx"; // Yeni ikon
import { TbBrandBooking } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import {
  faCar,
  faCalendar,
  faBell,
  faCog,
  faCreditCard,
  faSyncAlt,
  faFileAlt,
  faSignOutAlt,
  faUserAlt, // Diğer ikonlar
} from "@fortawesome/free-solid-svg-icons";
import { RiCarLine } from "react-icons/ri"; 
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function Sidebar() {

  
    const router = useRouter();
    const { user, logout } = useUser();
  

  const handleLogout=()=>{
    logout();
    router.push("/")

  }


  return (
    <div className="fixed h-screen w-64 bg-[#1A1919] text-white flex flex-col rounded-l-3xl mx-2 my-1 shadow-lg overflow-hidden top-0 left-0">
      <div className="px-6 py-4 text-sm flex items-center justify-center gap-3">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img
            src="/logoadmin.png"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-white text-sm">DRIVE NOW</span>
      </div>

      {/* Navigasyon */}
      <div>
        <nav className="flex flex-col gap-2 px-6 py-4">
          <Link
            href="/dashboard"
            className="hover:bg-[#006AFF] hover:border-l-2 hover:border-[#FFFFFF] px-4 py-2 rounded-sm transition flex items-center gap-2"
          >
            <RxDashboard className="w-6 h-6" />
            Dashboard
          </Link>
          <Link
            href="/admin/cars"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-sm transition flex items-center gap-2"
          >
            {/* React-Icons araç ikonu */}
            <RiCarLine
              className="w-6 h-6 text-[#ffffff] hover:text-[#006AFF] hover:fill-[#006AFF] hover:stroke-[#006AFF]"
            />
            Cars
          </Link>
          <Link
            href="/admin/drivers"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-sm transition flex items-center gap-2"
          >
            <CiUser className="w-6 h-6" />
            Drivers
          </Link>
          <Link
            href="/admin/rentals"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-sm transition flex items-center gap-2"
          >
            <TbBrandBooking className="w-6 h-6" />
            Car Rentals
          </Link>
          <Link
            href="/notifications"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-sm transition flex items-center gap-2"
          >
            <IoNotificationsOutline className="w-6 h-6" />
            Notifications
          </Link>
        </nav>

        {/* Çizgi ve Report */}
        <div className="border-t border-gray-600 mt-4 mx-6"></div>
        <div className="px-6 pt-4 mx-2 text-sm text-gray-400">Report</div>

        <nav className="flex flex-col gap-2 px-6 py-4">
          <Link
            href="/admin/payment-detail"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-md transition flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={faCreditCard}
              style={{ stroke: "#FFFFFF", strokeWidth: "18", color: "#1A1919" }}
              className="w-6 h-6"
            />
            Payment Details
          </Link>
          <Link
            href="/transactions"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-md transition flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={faSyncAlt}
              style={{ stroke: "#FFFFFF", strokeWidth: "18", color: "#1A1919" }}
              className="w-6 h-6"
            />
            Transactions
          </Link>
          <Link
            href="/car-report"
            className="hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-4 py-2 rounded-md transition flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ stroke: "#FFFFFF", strokeWidth: "18", color: "#1A1919" }}
              className="w-6 h-6"
            />
            Car Report
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto px-6 py-4 mb-4">
  <button
    onClick={handleLogout}
    className="bg-gray-700 hover:bg-[#006AFF] hover:border-l-4 hover:border-white px-16 py-2 rounded-md transition flex items-center gap-2 text-white"
  >
    <FontAwesomeIcon
      icon={faSignOutAlt}
      style={{ stroke: "#FFFFFF", strokeWidth: "18", color: "#1A1919" }}
      className="w-6 h-6"
    />
    Logout
  </button>
</div>

    </div>
  );
}
