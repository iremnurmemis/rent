import axios from "axios";
import { CarImage } from "./carLocationService";

export enum RentalStatus {
  Active = "Active",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export interface Car {
  pricePerHour: number;
  seatCount: number;
  year: number;
  plate: string;
}

export interface CarRental {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  rentalStatus: RentalStatus;
  brandName: string;
  categoryName: string;
  car: Car;
  modelName: string;
  fuelTypeName: string;
  transsmissionName: string;
  rentalType: string;
  overdueEndDate: string;
  totalOverdueFee: number;
  rentalImages: CarImage[];
  durationInDays:number;
}


export interface AdminCarRental{
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  rentalStatus: number;
  rentalType:string;
}

function mapRentalStatus(status: number): string {
  switch (status) {
    case 0:
      return RentalStatus.Active;
    case 1:
      return RentalStatus.Completed;
    case 2:
      return RentalStatus.Cancelled;
    default:
      return "Unknown";
  }
}

export const RentService = {
  startRental: async (
    carId: number,
    userId: number,
    cardId: number,
    rentalType:number,
    durationInDays:number,
    useBalance:boolean
  ): Promise<any> => {
    try {
      const response = await axios.post(
        `http://localhost:5153/api/CarRentals/AddCarRental`,
        {
          carId,
          userId,
          cardId,
          rentalType,
          durationInDays,
          useBalance
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("Kiralama başlatılırken hata oluştu", error.response.data);
      throw error;
    }
  },

  getUserActiveRentals: async (userId: number): Promise<CarRental> => {
    try {
      const response = await axios.get(
        `http://localhost:5153/api/CarRentals/getUserActiveCarRentalsDetails`,
        {
          params: { userId },
        }
      );
      const rentalData = response.data;
      rentalData.rentalStatus = mapRentalStatus(rentalData.rentalStatus);
      return rentalData;
    } catch (error: any) {
      console.log(
        "userın kiralaması getirilirken hata oldu",
        error.response.data
      );
      throw error;
    }
  },

  getUserAllRentals: async (userId: number): Promise<CarRental[]> => {
    try {
      const response = await axios.get(
        `http://localhost:5153/api/CarRentals/getUserAllCarRentalsDetails`,
        {
          params: { userId },
        }
      );

     
      const rentalData = response.data;
      const mappedRentalData = rentalData.map((rental: any) => ({
        ...rental,
        rentalStatus: mapRentalStatus(rental.rentalStatus),
        rentalImages: rental.rentalImages || [],
      }));
    
  
      return mappedRentalData;
    } catch (error: any) {
      console.log(
        "userın kiralamaları getirilirken hata oldu",
        error.response.data
      );
      throw error;
    }
  },

  getRentalById: async (rentalId: number): Promise<CarRental> => {
    try {
      const response = await axios.get(
        `http://localhost:5153/api/CarRentals/GetCarRentalById`,
        {
          params: {rentalId },
        }
      );

      const rentalData = response.data.data;
      const mappedRentalData = {
        ...rentalData,
        rentalStatus: mapRentalStatus(rentalData.rentalStatus),
        rentalImages: rentalData.rentalImages || [],
      };  
  
      return mappedRentalData;
    } catch (error: any) {
      console.log(
        "kiralama bilgisi getirilirken hata oldu",
        error.response.data
      );
      throw error;
    }
  },


   endRental : async (formData: FormData, rentalId: number): Promise<any> => {
    try {
        console.log("API'ye gönderilen formData:", formData); // Debug için log
        // FormData'ya rentalId'yi ekleyin
        formData.append("rentalId", rentalId.toString());
        
        // API'ye gönderim
        const response = await axios.post(
            "http://localhost:5153/api/CarRentals/CompleteCarRental", // URL'de rentalId yok, formData içinde
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },  // multipart/form-data header'ı kullanıyoruz
            }
        );
        return response.data;
    } catch (error: any) {
        console.log("Kiralama sonlandırılırken hata oluştu", error?.response?.data || error.message);
        throw error;
    }
  },
  

  updateRentalCardId:async(cardId:number,rentalId:number):Promise<any> => {
    try {
     
      const response = await axios.post(
        `http://localhost:5153/api/CarRentals/updatecardıd`,
        { cardId,rentalId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("Kiralama nesnesinin cardıd si update olurken hata oluştu", error?.response?.data || error.message);
      throw error;
    }
  },

  getAllRentals:async():Promise<AdminCarRental[]> =>{
    try {
     
      const response = await axios.get(
        `http://localhost:5153/api/CarRentals/GetAllRentals`,
      
      );
      const rentalData=response.data.data;
      return rentalData;
    } catch (error: any) {
      console.log("Kiralamalar getirilirken bir hata oldu.", error?.response?.data || error.message);
      throw error;
    }

  }
  
};
