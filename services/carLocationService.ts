import axios from 'axios'

export interface CarLocation {
    carId:number;
    latitude: number;
    longitude: number;
    category:string;
    brand:string;
    brandId:number;
    categoryId:number;
    pricePerHour: number;
    pricePerDay: number;
    model: string;
    seatCount: number;
    transmission: string;
    plate:string;
}

export interface CarDetail {
  carId:number;
  brandId:number;
  brandName: string;
  modelName: string;
  categoryName: string;
  pricePerHour: number;
  seatCount: number;
  transmission: string;
}

export interface CarImage{
  carId:number;
  imagePath:string;
  isMain:boolean;

}


export const CarLocationService={
  getAvailableCarsLocations: async () : Promise<CarLocation[]> => {
    try {
      const response = await axios.get("http://localhost:5153/api/Cars/getAvailableCarsLocations");
      return response.data.data; // API'den dönen araç konumlarını al
    } catch (error) {
      console.error("Araç konumları alınırken hata oluştu:", error);
      throw error;
    }
  },

  getAvailableCarsForList: async():Promise<CarDetail[]>=>{
    try {
      const response = await axios.get("http://localhost:5153/api/Cars/getCarListPage");
      console.log(response.data.data)
      return response.data.data; // API'den dönen araç konumlarını al
    } catch (error) {
      console.error("Araç konumları alınırken hata oluştu:", error);
      throw error;
    }
  },

  //belli kategorye göre arac getirme

  getAllCarsLocationByCategoryId: async (categoryId: number): Promise<CarLocation[]> => {
    try {
      const response = await axios.get(`http://localhost:5153/api/Cars/GetAllCarsLocationByCategoryId`, {
        params: { categoryId },
      });
      return response.data.data; // API'den dönen araç konumlarını al
    } catch (error) {
      console.error("Araç konumları alınırken hata oluştu:", error);
      throw error;
    }
  },

   //belli markaya göre arac getirme

   getAllCarsLocationByBrandId: async (brandId: number): Promise<CarLocation[]> => {
    try {
      const response = await axios.get(`http://localhost:5153/api/Cars/GetAllCarsLocationByBrandId`, {
        params: { brandId },
      });
      return response.data.data; // API'den dönen araç konumlarını al
    } catch (error) {
      console.error("Araç konumları alınırken hata oluştu:", error);
      throw error;
    }
  },

  getAllCarImages: async (carId: number): Promise<CarImage[]> => {
    try {
      const response = await axios.get(`http://localhost:5153/api/CarImages/GetByCarId`, {
        params: { carId },
      });
      return response.data.data; // API'den dönen araç konumlarını al
    } catch (error) {
      console.error("Araç konumları alınırken hata oluştu:", error);
      throw error;
    }
  },
  

};

