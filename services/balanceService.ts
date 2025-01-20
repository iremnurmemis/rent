
import axios from "axios";
import { AxiosError } from 'axios';

export interface UserBalance{
    id:number,
    userId:number,
    balance:number
}

export interface BalancePackage{
    id:number,
    name:string,
    price:number,
    creditAmount:number
}

export interface LoadBalance{
    userId:number,
    cardId:number,
    packageId:number
}

export const BalanceService = {
    getUserBalance: async (userId: number): Promise<UserBalance> => {
       try {
         const response = await axios.get(
           `http://localhost:5153/api/UserBalances/get-user-balance`,
           {
             params: { userId },
           }
         );
         
         const balance = response.data;    
         return balance;
       } catch (error: any) {
         console.error(
           "userın bakiye bilgileri getirilirken hata oldu",
           error.response.data
         );
         throw error;
       }
     },
     getBalancePackages: async() : Promise<BalancePackage[]> => {
        try {
          const response = await axios.get(
            `http://localhost:5153/api/BalancePackages/getAll`,
           
          );
          
          const packages = response.data;    
          return packages;
        } catch (error: any) {
          console.error(
            "bakiye paketleri getirilirken hata oldu",
            error.response.data
          );
          throw error;
        }
      },
      getBalancePackageById: async (packageId: number): Promise<BalancePackage> => {
        try {
          const response = await axios.get(
            `http://localhost:5153/api/BalancePackages/getById`,
            {
              params: { id: packageId },
            }
          );
          return response.data;  // The response itself is the package data
        } catch (error: any) {
          console.error("Error fetching package data", error.response?.data || error.message);
          throw error;
        }
      },
      LoadBalance:async(LoadBalance:LoadBalance):Promise<any>=>{
        try {
          const response = await axios.post(
            "http://localhost:5153/api/UserBalances/load-balance", 
            LoadBalance,
            { headers: { "Content-Type": "application/json" } }
          );
          console.log('Bakiye yükleme başarıyla gerçekleşti.', response.data);
          return response.data;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data;
                if (errorMessage && errorMessage.includes('Kart limiti yetersiz')) {
                    // If the error is related to insufficient card limit
                    console.log('Ödeme başarısız: Kart limiti yetersiz.');
                    alert('Ödeme başarısız: Kart limiti yetersiz.');
                } else {
                    // Handle other types of errors
                    console.log('Bakiye yüklenirken hata oluştu:', errorMessage);
                    alert('Bakiye yüklenirken bir hata oluştu.');
                }
            } else {
                console.log('Beklenmedik bir hata oluştu:', error);
                alert('Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.');
            }
            throw error;}
      }
    
      
   
};
