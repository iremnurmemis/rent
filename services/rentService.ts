import axios from "axios";

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
  fuelTypeName:string
  transsmissionName:string;
  rentalType:string;
  overdueEndDate:string;
  totalOverdueFee:number;
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
    durationInDays:number
  ): Promise<any> => {
    try {
      const response = await axios.post(
        `http://localhost:5153/api/CarRentals/AddCarRental`,
        {
          carId,
          userId,
          cardId,
          rentalType,
          durationInDays
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
      }));

      //console.log(mappedRentalData)
  
      return mappedRentalData;
    } catch (error: any) {
      console.log(
        "userın kiralamaları getirilirken hata oldu",
        error.response.data
      );
      throw error;
    }
  },

  endRental: async (rentalId: number): Promise<any> => {
    try {
      console.log("API'ye gönderilen rentalId:", rentalId); // Debug için log
      const response = await axios.post(
        `http://localhost:5153/api/CarRentals/CompleteCarRental`,
        { rentalId },
        {
          headers: { "Content-Type": "application/json" },
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
  }
  
};
