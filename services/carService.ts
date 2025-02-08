import axios from "axios";

export interface Car {
    brandId: number;
    modelId: number;
    colorId: number;
    categoryId: number;
    year: number;
    plate: string;
    isAvailable: boolean;
    fuelType: number;
    transmission: number;
    pricePerHour: number;
    pricePerDay: number;
    seatCount: number;
    latitude: number;
    longitude: number;
    carImages?: string[];
    mainImage?: string;
  }

  export interface CarImage {
    id: number;
    carId: number;
    imageUrl: string;
    isMain: boolean;
  }


  export interface CarDetail{
    id:number;
    brandName:string;
    modelName:string;
    categoryName:string;
    colorName:string;
    year:number;
    plate:string;
    isAvailable:boolean;
    fuelType:string;
    transmission:string;
    pricePerHour:number;
    seatCount:number;
    latitude:number;
    longitude:number;
    pricePerDay:number;
    mainImage:string;
    carImages: CarImage[];
  }

export const CarService = {
  async addCar(car: Car): Promise<any> {
    try {
      const response = await axios.post(
        "http://localhost:5153/api/Cars/Add",
        car,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding car:", error);
      throw error;
    }
  },

  async addCarImage(file: File, carId: number, isMain: boolean): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("carId", carId.toString());
      formData.append("IsMain", isMain.toString());

      const response = await axios.post(
        "http://localhost:5153/api/CarImages/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding car image:", error);
      throw error;
    }
  },

  async deleteCar(carId: number): Promise<void> {
    try {
      const response = await axios.post(
        `http://localhost:5153/api/Cars/Delete?carId=${carId}`,
        {}, // Boş body gönderiyoruz çünkü query param kullanıyoruz
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Araç başarıyla silindi:", response.data.message);
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Bilinmeyen bir hata oluştu";
  
        console.log("Silme işlemi başarısız:", errorMessage);
        alert(errorMessage); 
      } else {
        console.error("Sunucuya ulaşılamadı veya bilinmeyen bir hata oluştu.", error);
        alert("Sunucu hatası, lütfen daha sonra tekrar deneyin.");
      }
    }
  },

  async getCars(): Promise<CarDetail[]> {
    try {
      const response = await axios.get<{
        data: CarDetail[];
        success: boolean;
        message: string;
      }>("http://localhost:5153/api/Cars/GetAllDetails");
  
      return response.data.data; 
    } catch (error) {
      console.log("Araçlar getirilirken hata oluştu:", error);
      throw error; 
    }
  },

  async getCar(carId: number): Promise<CarDetail> {
    try {
      const response = await axios.get<{
        data: CarDetail;
        success: boolean;
        message: string;
      }>(`http://localhost:5153/api/Cars/GetCarDetail?carId=${carId}`);
  
      return response.data.data; 
    } catch (error) {
      console.log("Araç getirilirken hata oluştu:", error);
      throw error; 
    }
  },
  
  
   
  getCarDetailById: async (carId: number): Promise<Car> => {
      try {
        const response = await axios.get(`http://localhost:5153/api/Cars/GetByCarId`, {
          params: { carId },
        });
        return response.data; 
      } catch (error) {
        console.error("Araç bilgileri alınırken hata oluştu:", error);
        throw error;
      }
    },


}  