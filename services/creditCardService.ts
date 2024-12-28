import axios from 'axios'

export interface CreditCard{
   
}


export const CreditCardService={

 
   getUserCards: async (userId: number): Promise<CreditCard[]> => {
    try {
      const response = await axios.get(`http://localhost:5153/api/Cards/getUserCards`, {
        params: { userId },
      });
      return response.data.data; // API'den dönen araç konumlarını al
    } catch (error) {
      console.error("Userın kartları gelirken hata oluştu:", error);
      throw error;
    }
  },



};

