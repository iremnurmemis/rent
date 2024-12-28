import axios from 'axios'

export interface Category {
    id:number;
    name:string;
}

export interface Brand {
  id:number;
  name:string;
}



export const CarFilterService={
 
  getCategories: async():Promise<Category[]>=>{
    try {
      const response = await axios.get("http://localhost:5153/api/Categories/GetAll");
      console.log(response.data.data)
      return response.data.data; 
    } catch (error) {
      console.error("kategoriler alınırken hata oluştu:", error);
      throw error;
    }
  },

  getBrands: async():Promise<Brand[]>=>{
    try {
      const response = await axios.get("http://localhost:5153/api/Cars/GetAllAvailableBrand");
      console.log(response.data.data)
      return response.data.data; 
    } catch (error) {
      console.error("markalar alınırken hata oluştu:", error);
      throw error;
    }
  }

};

