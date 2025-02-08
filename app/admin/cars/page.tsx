"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CarService, CarDetail } from "@/services/carService";

function CarsPage() {
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [carNotification, setCarNotification] = useState("");
  const [photoNotification, setPhotoNotification] = useState("");
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
  const [isDeleteCarOpen, setIsDeleteCarOpen] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState("");
  const [deleteNotification, setDeleteNotification] = useState("");
  const [isDeletingCar, setIsDeletingCar] = useState(false);
  const [isUpdateCarOpen, setIsUpdateCarOpen] = useState(false);
  const [isUpdatingCar, setIsUpdatingCar] = useState(false);
  const [isCarListOpen, setIsCarListOpen] = useState(false);
  const [cars, setCars] = useState<CarDetail[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [carListError, setCarListError] = useState("");

  const router = useRouter();

  const [carData, setCarData] = useState({
    brandId: "",
    modelId: "",
    colorId: "",
    categoryId: "",
    year: "",
    plate: "",
    isAvailable: true,
    fuelType: "",
    transmission: "",
    pricePerHour: "",
    pricePerDay: "",
    seatCount: "",
    latitude: "",
    longitude: "",
    carRentals: [],
  });

  const [photoData, setPhotoData] = useState({
    carId: "",
    file: null,
    isMain: false,
  });

  useEffect(() => {
    if (isCarListOpen && cars.length === 0) {
      const fetchCars = async () => {
        setIsLoadingCars(true);
        try {
          const data = await CarService.getCars();
          console.log(data);
          setCars(data);
        } catch (error) {
          setCarListError("Araç listesi yüklenirken hata oluştu");
        } finally {
          setIsLoadingCars(false);
        }
      };
      fetchCars();
    }
  }, [isCarListOpen]);

  // Genel input değişiklikleri için (checkbox kontrolü de ekleniyor)
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setCarData({
      ...carData,
      [name]: val,
    });
  };

  const handlePhotoChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      setPhotoData({ ...photoData, file: e.target.files[0] });
    } else if (type === "checkbox") {
      setPhotoData({ ...photoData, [name]: checked });
    } else {
      setPhotoData({ ...photoData, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmittingCar(true);
    try {
      const result = await CarService.addCar({
        ...carData,
        brandId: parseInt(carData.brandId),
        modelId: parseInt(carData.modelId),
        colorId: parseInt(carData.colorId),
        categoryId: parseInt(carData.categoryId),
        year: parseInt(carData.year),
        fuelType: parseInt(carData.fuelType),
        transmission: parseInt(carData.transmission),
        pricePerHour: parseFloat(carData.pricePerHour),
        pricePerDay: parseFloat(carData.pricePerDay),
        seatCount: parseInt(carData.seatCount),
        latitude: parseFloat(carData.latitude),
        longitude: parseFloat(carData.longitude),
      });
      console.log(result);
      setCarNotification("Araba başarıyla eklendi!");
      // Formu sıfırlıyoruz
      setCarData({
        brandId: "",
        modelId: "",
        colorId: "",
        categoryId: "",
        year: "",
        plate: "",
        isAvailable: true,
        fuelType: "",
        transmission: "",
        pricePerHour: "",
        pricePerDay: "",
        seatCount: "",
        latitude: "",
        longitude: "",
        carRentals: [],
      });
    } catch (error) {
      alert("Araba eklenirken bir hata oluştu.");
    } finally {
      setIsSubmittingCar(false);
      setTimeout(() => {
        setCarNotification("");
      }, 3000);
    }
  };

  const handlePhotoSubmit = async (e: any) => {
    e.preventDefault();
    if (!photoData.file) {
      alert("Lütfen bir fotoğraf seçin.");
      return;
    }
    setIsSubmittingPhoto(true);
    try {
      const result = await CarService.addCarImage(
        photoData.file,
        Number(photoData.carId),
        photoData.isMain
      );
      console.log(result);
      setPhotoNotification("Fotoğraf başarıyla yüklendi!");
      // Fotoğraf formunu sıfırlıyoruz
      setPhotoData({
        carId: "",
        file: null,
        isMain: false,
      });
    } catch (error) {
      alert("Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setIsSubmittingPhoto(false);
      setTimeout(() => {
        setPhotoNotification("");
      }, 3000);
    }
  };

  const handleDeleteCar = async () => {
    if (!carIdToDelete) {
      alert("Lütfen bir araç ID girin.");
      return;
    }
    setIsDeletingCar(true);
    try {
      await CarService.deleteCar(parseInt(carIdToDelete));
      setDeleteNotification("Araç başarıyla silindi!");
      setCarIdToDelete("");
    } catch (error) {
      alert("Araç silinirken bir hata oluştu.");
    } finally {
      setIsDeletingCar(false);
      setTimeout(() => {
        setDeleteNotification("");
      }, 3000);
    }
  };

  const handleDetailsClick = (carId: number) => {
    router.push(`/admin/car-details?carId=${carId}`);
  };

  return (
    <div className="ml-[276px] p-6 bg-white shadow-sm rounded-lg m-[12px]">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Cars Management
      </h1>

      {/* Araba Ekleme Bölümü */}
      <div className="bg-gray-100 shadow-sm rounded-lg p-4 space-y-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsAddCarOpen((prev) => !prev)}
        >
          <h2 className="text-xl font-semibold text-gray-700">Add New Car</h2>
          <span className="text-xl text-gray-500">
            {isAddCarOpen ? "▲" : "▼"}
          </span>
        </div>
        {isAddCarOpen && (
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brand ID */}
              <div>
                <label htmlFor="brandId" className="block text-gray-700 mb-1">
                  Brand ID
                </label>
                <input
                  type="number"
                  id="brandId"
                  name="brandId"
                  placeholder="Brand ID"
                  value={carData.brandId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Model ID */}
              <div>
                <label htmlFor="modelId" className="block text-gray-700 mb-1">
                  Model ID
                </label>
                <input
                  type="number"
                  id="modelId"
                  name="modelId"
                  placeholder="Model ID"
                  value={carData.modelId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Color ID */}
              <div>
                <label htmlFor="colorId" className="block text-gray-700 mb-1">
                  Color ID
                </label>
                <input
                  type="number"
                  id="colorId"
                  name="colorId"
                  placeholder="Color ID"
                  value={carData.colorId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Category ID */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-gray-700 mb-1"
                >
                  Category ID
                </label>
                <input
                  type="number"
                  id="categoryId"
                  name="categoryId"
                  placeholder="Category ID"
                  value={carData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  placeholder="Year"
                  value={carData.year}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Plate */}
              <div>
                <label htmlFor="plate" className="block text-gray-700 mb-1">
                  Plate
                </label>
                <input
                  type="text"
                  id="plate"
                  name="plate"
                  placeholder="Plate"
                  value={carData.plate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Is Available */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={carData.isAvailable}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isAvailable" className="text-gray-700">
                  Available
                </label>
              </div>
              {/* Fuel Type */}
              <div>
                <label htmlFor="fuelType" className="block text-gray-700 mb-1">
                  Fuel Type
                </label>
                <input
                  type="number"
                  id="fuelType"
                  name="fuelType"
                  placeholder="Fuel Type"
                  value={carData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Transmission */}
              <div>
                <label
                  htmlFor="transmission"
                  className="block text-gray-700 mb-1"
                >
                  Transmission
                </label>
                <input
                  type="number"
                  id="transmission"
                  name="transmission"
                  placeholder="Transmission"
                  value={carData.transmission}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Price Per Hour */}
              <div>
                <label
                  htmlFor="pricePerHour"
                  className="block text-gray-700 mb-1"
                >
                  Price Per Hour
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="pricePerHour"
                  name="pricePerHour"
                  placeholder="Price Per Hour"
                  value={carData.pricePerHour}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Price Per Day */}
              <div>
                <label
                  htmlFor="pricePerDay"
                  className="block text-gray-700 mb-1"
                >
                  Price Per Day
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="pricePerDay"
                  name="pricePerDay"
                  placeholder="Price Per Day"
                  value={carData.pricePerDay}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Seat Count */}
              <div>
                <label htmlFor="seatCount" className="block text-gray-700 mb-1">
                  Seat Count
                </label>
                <input
                  type="number"
                  id="seatCount"
                  name="seatCount"
                  placeholder="Seat Count"
                  value={carData.seatCount}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Latitude */}
              <div>
                <label htmlFor="latitude" className="block text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  id="latitude"
                  name="latitude"
                  placeholder="Latitude"
                  value={carData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Longitude */}
              <div>
                <label htmlFor="longitude" className="block text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  id="longitude"
                  name="longitude"
                  placeholder="Longitude"
                  value={carData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmittingCar}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg"
            >
              {isSubmittingCar ? "Adding Car..." : "Add Car"}
            </button>
            {carNotification && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                {carNotification}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Araba Fotoğrafı Ekleme Bölümü */}
      <div className="bg-gray-100 shadow-sm rounded-lg p-4 space-y-6 mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsAddPhotoOpen((prev) => !prev)}
        >
          <h2 className="text-xl font-semibold text-gray-700">Add Car Photo</h2>
          <span className="text-xl text-gray-500">
            {isAddPhotoOpen ? "▲" : "▼"}
          </span>
        </div>
        {isAddPhotoOpen && (
          <form
            onSubmit={handlePhotoSubmit}
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="mb-4">
              <label htmlFor="carId" className="block text-gray-700 mb-1">
                Car ID
              </label>
              <input
                type="number"
                id="carId"
                name="carId"
                placeholder="Car ID"
                value={photoData.carId}
                onChange={handlePhotoChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="file" className="block text-gray-700 mb-1">
                Select Photo
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handlePhotoChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isMain"
                name="isMain"
                checked={photoData.isMain}
                onChange={handlePhotoChange}
                className="mr-2"
              />
              <label htmlFor="isMain" className="text-gray-700">
                Main Photo
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmittingPhoto}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg"
            >
              {isSubmittingPhoto ? "Uploading Photo..." : "Upload Photo"}
            </button>
            {photoNotification && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                {photoNotification}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Araç Silme Bölümü */}
      <div className="bg-gray-100 shadow-sm rounded-lg p-4 space-y-6 mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsDeleteCarOpen((prev) => !prev)}
        >
          <h2 className="text-xl font-semibold text-gray-700">Delete Car</h2>
          <span className="text-xl text-gray-500">
            {isDeleteCarOpen ? "▲" : "▼"}
          </span>
        </div>
        {isDeleteCarOpen && (
          <div className="p-4 bg-white rounded-lg shadow">
            <label htmlFor="deleteCarId" className="block text-gray-700 mb-1">
              Car ID
            </label>
            <input
              type="number"
              id="deleteCarId"
              value={carIdToDelete}
              onChange={(e) => setCarIdToDelete(e.target.value)}
              placeholder="Enter Car ID"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={handleDeleteCar}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              disabled={isDeletingCar}
            >
              {isDeletingCar ? "Deleting..." : "Delete Car"}
            </button>
            {deleteNotification && (
              <p className="text-green-600 mt-2">{deleteNotification}</p>
            )}
          </div>
        )}
      </div>

      {/* Araç Güncelleme Bölümü */}
      <div className="bg-gray-100 shadow-sm rounded-lg p-4 space-y-6 mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsUpdateCarOpen((prev) => !prev)}
        >
          <h2 className="text-xl font-semibold text-gray-700">Update Car</h2>
          <span className="text-xl text-gray-500">
            {isUpdateCarOpen ? "▲" : "▼"}
          </span>
        </div>
        {isUpdateCarOpen && (
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Car ID */}
              <div>
                <label htmlFor="carId" className="block text-gray-700 mb-1">
                  Update Car ID
                </label>
                <input
                  type="number"
                  id="carId"
                  name="carId"
                  placeholder="Update Car ID"
                  value={carData.brandId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Brand ID */}
              <div>
                <label htmlFor="brandId" className="block text-gray-700 mb-1">
                  Brand ID
                </label>
                <input
                  type="number"
                  id="brandId"
                  name="brandId"
                  placeholder="Brand ID"
                  value={carData.brandId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Model ID */}
              <div>
                <label htmlFor="modelId" className="block text-gray-700 mb-1">
                  Model ID
                </label>
                <input
                  type="number"
                  id="modelId"
                  name="modelId"
                  placeholder="Model ID"
                  value={carData.modelId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Color ID */}
              <div>
                <label htmlFor="colorId" className="block text-gray-700 mb-1">
                  Color ID
                </label>
                <input
                  type="number"
                  id="colorId"
                  name="colorId"
                  placeholder="Color ID"
                  value={carData.colorId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Category ID */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-gray-700 mb-1"
                >
                  Category ID
                </label>
                <input
                  type="number"
                  id="categoryId"
                  name="categoryId"
                  placeholder="Category ID"
                  value={carData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  placeholder="Year"
                  value={carData.year}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Plate */}
              <div>
                <label htmlFor="plate" className="block text-gray-700 mb-1">
                  Plate
                </label>
                <input
                  type="text"
                  id="plate"
                  name="plate"
                  placeholder="Plate"
                  value={carData.plate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Is Available */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={carData.isAvailable}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isAvailable" className="text-gray-700">
                  Available
                </label>
              </div>
              {/* Fuel Type */}
              <div>
                <label htmlFor="fuelType" className="block text-gray-700 mb-1">
                  Fuel Type
                </label>
                <input
                  type="number"
                  id="fuelType"
                  name="fuelType"
                  placeholder="Fuel Type"
                  value={carData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Transmission */}
              <div>
                <label
                  htmlFor="transmission"
                  className="block text-gray-700 mb-1"
                >
                  Transmission
                </label>
                <input
                  type="number"
                  id="transmission"
                  name="transmission"
                  placeholder="Transmission"
                  value={carData.transmission}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Price Per Hour */}
              <div>
                <label
                  htmlFor="pricePerHour"
                  className="block text-gray-700 mb-1"
                >
                  Price Per Hour
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="pricePerHour"
                  name="pricePerHour"
                  placeholder="Price Per Hour"
                  value={carData.pricePerHour}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Price Per Day */}
              <div>
                <label
                  htmlFor="pricePerDay"
                  className="block text-gray-700 mb-1"
                >
                  Price Per Day
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="pricePerDay"
                  name="pricePerDay"
                  placeholder="Price Per Day"
                  value={carData.pricePerDay}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Seat Count */}
              <div>
                <label htmlFor="seatCount" className="block text-gray-700 mb-1">
                  Seat Count
                </label>
                <input
                  type="number"
                  id="seatCount"
                  name="seatCount"
                  placeholder="Seat Count"
                  value={carData.seatCount}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Latitude */}
              <div>
                <label htmlFor="latitude" className="block text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  id="latitude"
                  name="latitude"
                  placeholder="Latitude"
                  value={carData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Longitude */}
              <div>
                <label htmlFor="longitude" className="block text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  id="longitude"
                  name="longitude"
                  placeholder="Longitude"
                  value={carData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmittingCar}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg"
            >
              {isSubmittingCar ? "Adding Car..." : "Update Car"}
            </button>
            {carNotification && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                {carNotification}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Araba Listeleme  */}
      <div className="bg-gray-100 shadow-sm rounded-lg p-4 space-y-6 mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsCarListOpen((prev) => !prev)}
        >
          <h2 className="text-xl font-semibold text-gray-700  ">Cars List</h2>
          <span className="text-xl text-gray-500">
            {isCarListOpen ? "▲" : "▼"}
          </span>
        </div>

        {isCarListOpen && (
          <div className="overflow-x-auto p-2">
            <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white text-sm">
                <tr className="text-left">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Plate</th>
                  <th className="px-4 py-3">Price/Hour</th>
                  <th className="px-4 py-3">Price/Day</th>
                  <th className="px-4 py-3">isAvailable</th>
                  <th className="px-4 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {isLoadingCars ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Loading cars...
                    </td>
                  </tr>
                ) : carListError ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-red-500">
                      {carListError}
                    </td>
                  </tr>
                ) : (
                  cars.map((car, index) => (
                    <tr
                      key={car.id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-200 transition`}
                    >
                      <td className="px-4 py-3">{car.id}</td>
                      <td className="px-4 py-3">{car.brandName}</td>
                      <td className="px-4 py-3">{car.modelName}</td>
                      <td className="px-4 py-3">{car.categoryName}</td>
                      <td className="px-4 py-3">{car.plate}</td>
                      <td className="px-6 py-3">{car.pricePerHour} TL</td>
                      <td className="px-6 py-3">{car.pricePerDay} TL</td>
                      <td className="px-6 py-3">
                        {car.isAvailable ? "Available" : "Not Available"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                          onClick={() => handleDetailsClick(car.id)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarsPage;
