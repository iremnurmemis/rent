"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
  TooltipProps
} from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md rounded-md text-sm">
        <p className="font-bold">{payload[0].name}</p>
        <p>Adet: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function DashboardPage() {
  type CategoryRentalCount = {
    categoryName: string;
    rentalCount: number;
  };

  type RentalStatistics = {
    label: string;
    count: number;
  };

  type CarAvailability = {
    status: string;
    count: number;
  };

  const [chartData, setChartData] = useState<CategoryRentalCount[]>([]);
  const [rentalStats, setRentalStats] = useState<RentalStatistics[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("weekly");
  const [carAvailability, setCarAvailability] = useState<CarAvailability[]>([]);

  useEffect(() => {
    fetch("http://localhost:5153/api/dashboards/rented-cars-by-category")
      .then((response) => response.json())
      .then((data: CategoryRentalCount[]) => setChartData(data))
      .catch((error) => console.error("Veri çekme hatası:", error));

    fetch(
      `http://localhost:5153/api/dashboards/rental-count-by-filter?filter=${selectedFilter}`
    )
      .then((response) => response.json())
      .then((data: RentalStatistics[]) => setRentalStats(data))
      .catch((error) => console.error("Veri çekme hatası:", error));

    fetch("http://localhost:5153/api/dashboards/availability")
      .then((response) => response.json())
      .then((data) =>
        setCarAvailability([
          { status: "Mevcut Araçlar", count: data.availableCars },
          { status: "Kiralanan Araçlar", count: data.rentedCars },
        ])
      )
      .catch((error) => console.error("Veri çekme hatası:", error));
  }, [selectedFilter]);

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  return (
    <div className="ml-72 p-4 flex flex-wrap justify-between gap-6">
      {/* Kiralama Sayıları */}
      <div className="bg-white shadow-lg rounded-xl p-4 w-[32%] min-w-[300px] transition-transform transform hover:scale-105">
        <h3 className="text-md font-bold text-gray-800 mb-4 text-center">
          Kiralama Sayıları ({selectedFilter})
        </h3>
        <div className="mb-5 flex justify-center gap-3">
          {["daily", "weekly", "monthly", "yearly"].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-2 rounded-full transition duration-200 ${
                selectedFilter === filter
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        {rentalStats.length === 0 ? (
          <p className="text-center text-gray-500">
            {selectedFilter} içinde kiralama yapılmamıştır.
          </p>
        ) : (
          <div className="w-full h-60 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentalStats} margin={{ bottom: 20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 14 }} dy={5} />
                <YAxis tick={{ fontSize: 14 }} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="count"
                  name="Kiralama Sayısı"
                  fill="#4BC0C0"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Araç Kategorileri */}
      <div className="bg-white shadow-lg rounded-xl p-4 w-[32%] min-w-[300px] transition-transform transform hover:scale-105">
        <h3 className="text-md font-bold text-gray-800 mb-8 text-center">
          Araç Kiralama Sayısı - Kategorilere Göre
        </h3>
        {chartData.length === 0 ? (
          <p className="text-center text-gray-500">
            Bu dönemde herhangi bir kiralama yapılmamıştır.
          </p>
        ) : (
          <div className="w-full h-60 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ bottom: 20 }}>
                <XAxis
                  dataKey="categoryName"
                  interval={0}
                  tick={{ fontSize: 14 }}
                  dy={5}
                />
                <YAxis tick={{ fontSize: 14 }} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="rentalCount" name="Kiralama Sayısı" barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Araç Kullanılabilirlik Durumu */}
      <div className="bg-white shadow-lg rounded-xl p-4 w-[32%] min-w-[300px] transition-transform transform hover:scale-105">
        <h3 className="text-md font-bold text-gray-800 mb-8 text-center">
          Araç Kullanılabilirlik Durumu
        </h3>
        {carAvailability.length === 0 ? (
          <p className="text-center text-gray-500">
            Araç kullanılabilirlik bilgisi bulunmamaktadır.
          </p>
        ) : (
          <div className="w-full h-60 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carAvailability}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {carAvailability.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}

export default DashboardPage;
