import axios from 'axios'
import { AxiosError } from 'axios';

export interface CreditCardDetail{
  id:number,
  cardType:number,
  cardHolderName:string,
  cardNumber:string
}

export interface AddCreditCard{
  userId:number,
  cardNumber:string,
  cardHolderName:string,
  expireMonth:string,
  expireYear:string,
  cardType: number;
  id?: number;
}

export interface AddCreditCardResponse {
  data: AddCreditCard;
  message: string;
  success: boolean;
}

export const CreditCardService={

 
   getUserCards: async (userId: number): Promise<CreditCardDetail[]> => {
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

  addCreditCard:async(card:AddCreditCard):Promise<AddCreditCardResponse>=>{
    try {
      const response = await axios.post(
        "http://localhost:5153/api/Cards/addCard", 
        card, 
        { headers: { "Content-Type": "application/json" } }
      );
      console.log('Kart başarıyla eklendi:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('Kart eklenirken hata oluştu:', error.response?.data); // Backend'den dönen detaylı hata mesajı
      } else {
        console.error('Beklenmedik bir hata oluştu:', error);
      }
      throw error;
    }
  }


};

