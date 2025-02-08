
import axios from "axios";
import { AxiosError } from 'axios';

export interface UserInfo{
    id:number,
    firstName:string,
    lastName:string,
    email:string,
    phoneNumber:string,
    status:boolean,
    isDrivingLicenseVerified:boolean
}


export interface UserDetail{
  userId:number,
  fullname:string,
  email:string,
  phone:string,
  status:boolean,
  ısLicenceVerified:boolean,
  balance:number,
  licenceNo:string,
  validUntil:string,
  uploadDate:string
}

export interface UserRents{
  rentalId:number,
  carId:number,
  startDate:string,
  endDate:string,
  totalPrice:number,
  rentalStatus:string,
  rentalType:string;
  overduePrice:number;
  overdueDate:string
}

export interface UserPayments{
  id:number,
  carId:number,
  rentalId:number,
  status:string,
  created:string,
  paymentType:number,
  balancePackageId?:number,
  totalPrice:number

}


export const UserService = {
    getUsersInfo: async (): Promise<UserInfo[]> => {
       try {
         const response = await axios.get(
           `http://localhost:5153/api/Users/get-all-user`,
          
         );
         
         const users = response.data.data;    
         return users;
       } catch (error: any) {
         console.error(
           "kullanıcı listesi getirilirken hata oldu",
           error.response.data
         );
         throw error;
       }
     },
  
 

    getUserDetail: async (userId: number): Promise<UserDetail> => {
      try {
        const response = await axios.get(`http://localhost:5153/api/UserBalances/getUserDetail`, {
          params: { userId }  
        });
    
        const user = response.data;
        return user;
      } catch (error: any) {
        console.error("kullanıcı getirilirken hata oldu", error.response?.data || error);
        throw error;
      }
    },

    getUserRents:async (userId: number): Promise<UserRents[]> => {
      try {
        const response = await axios.get(`http://localhost:5153/api/CarRentals/getUserCarRentalsDetailsforFrontend`, {
          params: { userId }  
        });
    
        const user = response.data;
        return user;
      } catch (error: any) {
        console.error("kullanıcı  kiralamaları getirilirken hata oldu", error.response?.data || error);
        throw error;
      }
    },

    getUserPayments:async (userId: number): Promise<UserPayments[]> => {
      try {
        const response = await axios.get(`http://localhost:5153/api/Payments/GetUserPayments`, {
          params: { userId }  
        });
    
        const payments = response.data;
        return payments;
      } catch (error: any) {
        console.error("kullanıcı ödemeleri getirilirken hata oldu", error.response?.data || error);
        throw error;
      }
    }

    
 
   
};
