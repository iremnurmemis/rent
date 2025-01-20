import axios from 'axios'
import { AxiosError } from 'axios';


export interface AddForm{
  userId:number,
  firstName:string,
  lastName:string,
  email:string,
  phone:string,
  contactText:string
}

export const ContactUsService={

  addContactForm:async(form:AddForm):Promise<any>=>{
    try {
      const response = await axios.post(
        "http://localhost:5153/api/ContactForms/add", 
        form, 
        { headers: { "Content-Type": "application/json" } }
      );
      console.log('Form başarıyla gönderildi', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('Form eklenirken hata oluştu:', error.response?.data); // Backend'den dönen detaylı hata mesajı
      } else {
        console.error('Beklenmedik bir hata oluştu:', error);
      }
      throw error;
    }
  }


};
