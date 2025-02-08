import axios from "axios";

export enum PaymentStatus {
  Success = "Success",
  Failed = "Failed",
  Unknown = "Unknown",
}

export function mapRentalStatus(status: number): string {
  switch (status) {
    case 0:
      return PaymentStatus.Success;
    case 1:
      return PaymentStatus.Failed;
    default:
      return PaymentStatus.Unknown;
  }
}

  export interface Payment{
      id:number,
      cardId:number,
      cardHolderName:string,
      cardNumber:string,
      userId:number,
      rentalId:number,
      rentalAmount:number,
      status:string,
      carId:number,
      plate:string,
      model:string,
      brand:string
      created:string
  }

  export interface PaymentDetail{
    id:number,
    cardNumber:string,
    userId:number,
    rentalId:number,
    status:string,
    carId:number,
    created:string,
    totalPrice:number,
    balancePackageId:number,
    paymentType:string,
  }

export const PaymentService = {
    getUserPayments: async (userId: number): Promise<Payment[]> => {
       try {
         const response = await axios.get(
           `http://localhost:5153/api/Payments/GetPaymentByUserId`,
           {
             params: { userId },
           }
         );
         
         const paymentsData = response.data;    
         return paymentsData;
       } catch (error: any) {
         console.error(
           "userın ödemeleri getirilirken hata oldu",
           error.response.data
         );
         throw error;
       }
     },

     getAllPayments: async(): Promise<PaymentDetail[]> => {
      try {
        const response = await axios.get(
          `http://localhost:5153/api/Payments/GetPaymentsFront`,
        
        );
        
        const paymentsData = response.data;    
        return paymentsData;
      } catch (error: any) {
        console.error(
          "Ödeme bilgileri getirilirken hata oldu",
          error.response.data
        );
        throw error;
      }
    },
   
};
